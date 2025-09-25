import { QueryClient } from '@tanstack/react-query';
import { addMilliseconds, subSeconds } from 'date-fns';
import { Persistor } from 'redux-persist';

import {
  EntityProgression,
  EntityProgressionInProgress,
} from '@app/abstract/lib/types/entityProgress';
import { SendAnswersInput } from '@app/entities/activity/lib/types/uploadAnswers';
import { appletActions } from '@app/entities/applet/model/slice';
import { getDefaultSvgFileManager } from '@app/entities/drawer/lib/utils/svgFileManagerInstance';
import { ActivityState } from '@app/features/pass-survey/lib/hooks/useActivityStorageRecord';
import {
  AnswerAlerts,
  ScoreRecord,
} from '@app/features/pass-survey/lib/types/summary';
import { InitializeHiddenItem } from '@app/features/pass-survey/model/ActivityRecordInitializer';
import { IAlertsExtractor } from '@app/features/pass-survey/model/IAlertsExtractor';
import { IScoresExtractor } from '@app/features/pass-survey/model/IScoresExtractor';
import { ResponseType } from '@app/shared/api/services/ActivityItemDto';
import { AppletEncryptionDTO } from '@app/shared/api/services/IAppletService';
import { QueryDataUtils } from '@app/shared/api/services/QueryDataUtils';
import { ILogger } from '@app/shared/lib/types/logger';
import { wait } from '@app/shared/lib/utils/common';
import { getNow, getTimezoneOffset } from '@app/shared/lib/utils/dateTime';
import { getResponseTypesMap } from '@app/shared/lib/utils/responseTypes';
import {
  isEntityExpired,
  getEntityProgression,
} from '@app/shared/lib/utils/survey/survey';
import { trackCompleteSurvey } from '@app/widgets/survey/lib/surveyStateAnalytics';
import { IQueueProcessingService } from '@entities/activity/lib/services/IQueueProcessingService';
import { IAnswersQueueService } from '@entities/activity/lib/services/IAnswersQueueService';

import { getClientInformation } from '../../lib/metaHelpers';
import {
  clearActivityStorageRecord,
  getActivityRecord,
  getFlowRecord,
} from '../../lib/storageHelpers';
import { ActivitySummaryData } from '../../lib/useFlowStorageRecord';
import {
  mapAnswersToAlerts,
  mapAnswersToDto,
  mapUserActionsToDto,
} from '../mappers';
import {
  createSvgFiles,
  fillNullsForHiddenItems,
  getActivityProgressionStartAt,
  getItemIds,
  getUserIdentifier,
} from '../operations';

type SaveActivitySummary = (activitySummary: ActivitySummaryData) => void;

type ConstructForIntermediateInput = {
  appletId: string;
  activityId: string;
  flowId: string;
  eventId: string;
  targetSubjectId: string | null;
  order: number;
  activityName: string;
  isAutocompletion: boolean;
};

type ConstructForFinishInput = {
  appletId: string;
  activityId: string;
  flowId: string | undefined;
  eventId: string;
  targetSubjectId: string | null;
  order: number;
  activityName: string;
  isAutocompletion: boolean;
};

export type CompletionType = 'intermediate' | 'finish';

export type ConstructInput = (
  | ConstructForIntermediateInput
  | ConstructForFinishInput
) & {
  completionType: CompletionType;
};

const DistinguishInterimAndFinishLag = 1; // For correct sort on BE, Admin, TODO

export class ConstructCompletionsService {
  private logger: ILogger;
  private saveActivitySummary: SaveActivitySummary | null;
  private queryDataUtils: QueryDataUtils;
  private entityProgressions: EntityProgression[];
  private pushToQueueService: IQueueProcessingService;
  private alertsExtractor: IAlertsExtractor;
  private scoresExtractor: IScoresExtractor;
  private dispatch: AppDispatch;
  private persistor: Persistor;
  private itemTypesMap: Record<string, ResponseType[]>;
  private queueService: IAnswersQueueService;

  constructor(
    saveActivitySummary: SaveActivitySummary | null,
    logger: ILogger,
    queryClient: QueryClient,
    pushToQueueService: IQueueProcessingService,
    alertsExtractor: IAlertsExtractor,
    scoresExtractor: IScoresExtractor,
    dispatch: AppDispatch,
    persistor: Persistor,
    entityProgressions: EntityProgression[],
    queueService: IAnswersQueueService,
  ) {
    this.saveActivitySummary = saveActivitySummary;
    this.logger = logger;
    this.queryDataUtils = new QueryDataUtils(queryClient);
    this.pushToQueueService = pushToQueueService;
    this.alertsExtractor = alertsExtractor;
    this.scoresExtractor = scoresExtractor;
    this.dispatch = dispatch;
    this.entityProgressions = entityProgressions;
    this.persistor = persistor;
    this.itemTypesMap = {};
    this.queueService = queueService;
  }

  private getLogDates(
    evaluatedEndAt: number,
    availableTo: number | null,
  ): string {
    const logEndAt: string = new Date(evaluatedEndAt).toUTCString();
    const logAvailableTo = !availableTo
      ? 'not set'
      : new Date(availableTo).toUTCString();

    return `evaluatedEndAt: "${logEndAt}|${evaluatedEndAt}", availableTo: ${logAvailableTo}`;
  }

  private logFinish(
    activityName: string,
    activityId: string,
    flowId: string | undefined,
    appletName: string,
    appletId: string,
    evaluatedEndAt: number,
    availableTo: number | null,
    submitId: string,
  ) {
    const logDates = this.getLogDates(evaluatedEndAt, availableTo);

    this.logger.log(
      `[ConstructCompletionsService.logFinish]: Activity: "${activityName}|${activityId}", applet: "${appletName}|${appletId}", submitId: ${submitId}, ${logDates}`,
    );

    if (flowId) {
      this.logger.log(
        `[ConstructCompletionsService.logFinish]: Flow "${flowId}", applet "${appletName}|${appletId}", submitId: ${submitId}, ${logDates}`,
      );
    }
  }

  private logIntermediate(
    {
      activityName,
      activityId,
      flowId,
      appletId,
    }: ConstructForIntermediateInput,
    flowName: string,
    appletName: string,
    evaluatedEndAt: number,
    availableTo: number | null,
    submitId: string,
  ) {
    const logDates = this.getLogDates(evaluatedEndAt, availableTo);

    this.logger.log(
      `[ConstructCompletionsService.logIntermediate]: Activity: "${activityName}|${activityId}", flow: "${flowName}|${flowId}", applet: "${appletName}|${appletId}", submitId: ${submitId}, ${logDates}`,
    );
  }

  private evaluateEndAt(
    completionType: CompletionType,
    availableTo: number | null,
    isAutocompletion: boolean,
  ): number {
    if (!isAutocompletion || !availableTo) {
      return getNow().getTime();
    }

    if (!isEntityExpired(availableTo)) {
      return completionType === 'intermediate'
        ? getNow().getTime()
        : addMilliseconds(getNow(), DistinguishInterimAndFinishLag).getTime();
    }

    const aSecondBeforeAvailableTo = subSeconds(availableTo, 1);

    return completionType === 'intermediate'
      ? aSecondBeforeAvailableTo.getTime()
      : addMilliseconds(
          aSecondBeforeAvailableTo,
          DistinguishInterimAndFinishLag,
        ).getTime();
  }

  private getAppletProperties(appletId: string): {
    appletEncryption: AppletEncryptionDTO | null;
    appletName: string;
  } {
    const appletDto = this.queryDataUtils.getAppletDto(appletId);

    if (!appletDto) {
      throw new Error(
        `[ConstructCompletionsService] Applet doesn't exist in the cache, appletId=${appletId} `,
      );
    }

    return {
      appletEncryption: appletDto.encryption,
      appletName: appletDto.displayName,
    };
  }

  private validateEncryption(
    appletEncryption: AppletEncryptionDTO | null | undefined,
  ) {
    if (!appletEncryption) {
      const error =
        '[ConstructCompletionsService] Encryption params is undefined';
      this.logger.warn(error);
      throw new Error(error);
    }
  }

  private isRecordExist(
    activityStorageRecord: ActivityState | null | undefined,
  ): boolean {
    if (!activityStorageRecord) {
      this.logger.warn(
        '[ConstructCompletionsService] activityStorageRecord does not exist',
      );
      return false;
    }
    return true;
  }

  private addSummaryData(
    activityStorageRecord: ActivityState,
    { activityName, activityId, order }: ConstructForIntermediateInput,
  ) {
    if (!this.saveActivitySummary) {
      return;
    }

    const summaryAlerts: AnswerAlerts = this.alertsExtractor.extractForSummary(
      activityStorageRecord.items,
      activityStorageRecord.answers,
      activityName,
    );

    const scores: ScoreRecord[] = this.scoresExtractor.extract(
      activityStorageRecord.items,
      activityStorageRecord.answers,
      activityStorageRecord.scoreSettings,
      activityName,
    );

    this.saveActivitySummary({
      activityId,
      order,
      alerts: summaryAlerts,
      scores: {
        activityName,
        scores,
      },
    });
  }

  private async constructForIntermediate(
    input: ConstructForIntermediateInput,
  ): Promise<void> {
    this.logger.log(
      '[ConstructCompletionsService.constructForIntermediate] input:\n' +
        JSON.stringify(input, null, 2),
    );

    const {
      appletId,
      flowId,
      activityId,
      eventId,
      targetSubjectId,
      order,
      activityName,
      isAutocompletion,
    } = input;

    const activityStorageRecord = getActivityRecord(
      appletId,
      activityId,
      eventId,
      targetSubjectId,
      order,
    )!;

    if (!this.isRecordExist(activityStorageRecord)) {
      return;
    }

    const { appletEncryption, appletName } = this.getAppletProperties(appletId);

    this.validateEncryption(appletEncryption);

    const { items, answers: recordAnswers, actions } = activityStorageRecord;

    await createSvgFiles(getDefaultSvgFileManager(), items, recordAnswers);

    if (activityStorageRecord.hasSummary) {
      this.addSummaryData(activityStorageRecord, input);
    }

    const answers = mapAnswersToDto(items, recordAnswers);

    const {
      itemIds,
      itemTypes,
      answers: modifiedAnswers,
    } = fillNullsForHiddenItems(
      getItemIds(items),
      answers,
      activityStorageRecord.context.originalItems as InitializeHiddenItem[],
    );

    const progression = getEntityProgression(
      appletId,
      flowId,
      eventId,
      targetSubjectId,
      this.entityProgressions,
    ) as EntityProgressionInProgress;

    const { flowName, scheduledDate } = getFlowRecord(
      flowId,
      appletId,
      eventId,
      targetSubjectId,
    )!;

    const scheduledEvent = this.queryDataUtils.getEventDto(appletId, eventId);

    const evaluatedEndAt = this.evaluateEndAt(
      'intermediate',
      progression.availableUntilTimestamp,
      isAutocompletion,
    );

    const submitId = progression.submitId;

    this.logIntermediate(
      input,
      flowName!,
      appletName,
      evaluatedEndAt,
      progression.availableUntilTimestamp,
      submitId,
    );

    this.pushToQueueService.push({
      appletId,
      createdAt: evaluatedEndAt,
      version: activityStorageRecord.appletVersion,
      answers: modifiedAnswers,
      userActions: mapUserActionsToDto(actions),
      itemIds,
      itemTypes,
      appletEncryption: appletEncryption!,
      flowId,
      activityId,
      submitId,
      userIdentifier: getUserIdentifier(items, recordAnswers),
      startTime: getActivityProgressionStartAt(progression)!.getTime(),
      endTime: evaluatedEndAt,
      scheduledTime: scheduledDate,
      activityName,
      logCompletedAt: getNow().toUTCString(),
      client: getClientInformation(),
      alerts: mapAnswersToAlerts(items, recordAnswers),
      eventId,
      targetSubjectId,
      isFlowCompleted: false,
      tzOffset: getTimezoneOffset(),
      eventVersion: scheduledEvent?.version,
    });

    clearActivityStorageRecord(
      appletId,
      activityId,
      eventId,
      targetSubjectId,
      order,
    );

    trackCompleteSurvey({
      appletId,
      activityId,
      flowId,
      itemTypes: this.itemTypesMap[activityId],
      submitId,
      pipelineItems: items,
    });

    this.logger.log(
      `[ConstructCompletionsService.constructForIntermediate] Done`,
    );
  }

  private async constructForFinish(
    input: ConstructForFinishInput,
  ): Promise<void> {
    this.logger.log(
      '[ConstructCompletionsService.constructForFinish] input:\n' +
        JSON.stringify(input, null, 2),
    );

    const {
      appletId,
      flowId,
      activityId,
      eventId,
      targetSubjectId,
      order,
      activityName,
      isAutocompletion,
    } = input;

    const entityId = flowId ? flowId : activityId;

    const activityStorageRecord = getActivityRecord(
      appletId,
      activityId,
      eventId,
      targetSubjectId,
      order,
    )!;

    if (!this.isRecordExist(activityStorageRecord)) {
      return;
    }

    const { appletEncryption, appletName } = this.getAppletProperties(appletId);

    this.validateEncryption(appletEncryption);

    const progression = getEntityProgression(
      appletId,
      entityId,
      eventId,
      targetSubjectId,
      this.entityProgressions,
    ) as EntityProgressionInProgress;

    const evaluatedEndAt = this.evaluateEndAt(
      'finish',
      progression.availableUntilTimestamp,
      isAutocompletion,
    );

    this.dispatch(
      appletActions.completeEntity({
        appletId,
        eventId,
        entityId,
        targetSubjectId,
        endAt: evaluatedEndAt,
      }),
    );

    await this.persistor.flush();

    const { items, answers: recordAnswers, actions } = activityStorageRecord;

    await createSvgFiles(getDefaultSvgFileManager(), items, recordAnswers);

    const alerts = mapAnswersToAlerts(items, recordAnswers);

    const answers = mapAnswersToDto(items, recordAnswers);

    const userIdentifier = getUserIdentifier(items, recordAnswers);

    const userActions = mapUserActionsToDto(actions);

    const {
      itemIds,
      itemTypes,
      answers: modifiedAnswers,
    } = fillNullsForHiddenItems(
      getItemIds(items),
      answers,
      activityStorageRecord.context.originalItems as InitializeHiddenItem[],
    );

    const submitId = progression.submitId;

    this.logFinish(
      activityName,
      activityId,
      flowId,
      appletName,
      appletId,
      evaluatedEndAt,
      progression.availableUntilTimestamp,
      submitId,
    );

    const { scheduledDate } = getFlowRecord(
      flowId,
      appletId,
      eventId,
      targetSubjectId,
    )!;

    const scheduledEvent = this.queryDataUtils.getEventDto(appletId, eventId);

    const itemToUpload: SendAnswersInput = {
      appletId,
      createdAt: evaluatedEndAt,
      version: activityStorageRecord.appletVersion,
      answers: modifiedAnswers,
      userActions,
      itemIds,
      itemTypes,
      appletEncryption: appletEncryption!,
      flowId: flowId ?? null,
      activityId,
      submitId,
      userIdentifier,
      startTime: getActivityProgressionStartAt(progression)!.getTime(),
      endTime: evaluatedEndAt,
      scheduledTime: scheduledDate,
      activityName,
      logCompletedAt: getNow().toUTCString(),
      client: getClientInformation(),
      alerts,
      eventId,
      targetSubjectId,
      isFlowCompleted: flowId 
        ? !this.queueService.hasOtherPendingFlowActivities(submitId, activityId, flowId)
        : false,
      tzOffset: getTimezoneOffset(),
      eventVersion: scheduledEvent?.version,
    };

    this.pushToQueueService.push(itemToUpload);

    await wait(500); // M2-6153

    clearActivityStorageRecord(
      appletId,
      activityId,
      eventId,
      targetSubjectId,
      order,
    );

    trackCompleteSurvey({
      appletId,
      flowId,
      activityId,
      itemTypes: this.itemTypesMap[activityId],
      submitId,
      pipelineItems: items,
    });

    this.logger.log(`[ConstructCompletionsService.constructForFinish] Done`);
  }

  public async construct(input: ConstructInput): Promise<void> {
    const baseInfo = this.queryDataUtils.getBaseInfo(input.appletId);
    if (baseInfo) {
      this.itemTypesMap = getResponseTypesMap(baseInfo);
    }

    try {
      if (input.completionType === 'intermediate') {
        await this.constructForIntermediate({
          ...input,
          flowId: input.flowId!,
        });
      }

      if (input.completionType === 'finish') {
        await this.constructForFinish(input);
      }
    } catch (error) {
      this.logger.warn(
        `[ConstructCompletionsService.construct] Error occurred: \n${error}`,
      );
    }
  }
}
