import { QueryClient } from '@tanstack/react-query';
import { addMilliseconds } from 'date-fns';

import { StoreProgress } from '@app/abstract/lib';
import { IPushToQueue } from '@app/entities/activity';
import { AppletModel } from '@app/entities/applet';
import {
  ActivityState,
  AnswerAlerts,
  PassSurveyModel,
  ScoreRecord,
} from '@app/features/pass-survey';
import { InitializeHiddenItem } from '@app/features/pass-survey/model';
import { AppletEncryptionDTO, QueryDataUtils } from '@app/shared/api';
import {
  AnalyticsService,
  getEntityProgress,
  getNow,
  getTimezoneOffset,
  isEntityExpired,
  Logger,
  MixEvents,
  MixProperties,
} from '@app/shared/lib';

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
  getActivityStartAt,
  getExecutionGroupKey,
  getItemIds,
  getUserIdentifier,
} from '../operations';

type SaveActivitySummary = (activitySummary: ActivitySummaryData) => void;

type ConstructForIntermediateInput = {
  appletId: string;
  activityId: string;
  flowId: string;
  eventId: string;
  order: number;
  activityName: string;
  isAutocompletion: boolean;
};

type ConstructForFinishInput = {
  appletId: string;
  activityId: string;
  flowId: string | undefined;
  eventId: string;
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
  private saveActivitySummary: SaveActivitySummary | null;
  private queryDataUtils: QueryDataUtils;
  private storeProgress: StoreProgress;
  private pushToQueueService: IPushToQueue;
  private dispatch: AppDispatch;

  constructor(
    saveActivitySummary: SaveActivitySummary | null,
    queryClient: QueryClient,
    storeProgress: StoreProgress,
    pushToQueueService: IPushToQueue,
    dispatch: AppDispatch,
  ) {
    this.saveActivitySummary = saveActivitySummary;
    this.queryDataUtils = new QueryDataUtils(queryClient);
    this.storeProgress = storeProgress;
    this.pushToQueueService = pushToQueueService;
    this.dispatch = dispatch;
  }

  private getLogDates(
    evaluatedEndAt: number,
    availableTo: number | null,
  ): string {
    const logEndAt: string = new Date(evaluatedEndAt).toUTCString();
    const logAvailableTo = !availableTo
      ? 'not set'
      : new Date(availableTo).toUTCString();

    return `evaluatedEndAt = ${logEndAt}, availableTo = ${logAvailableTo}`;
  }

  private logCompletion(
    activityName: string,
    activityId: string,
    flowId: string | undefined,
    appletName: string,
    appletId: string,
    evaluatedEndAt: number,
    availableTo: number | null,
  ) {
    const logDates = this.getLogDates(evaluatedEndAt, availableTo);

    Logger.log(
      `[ConstructCompletionsService]: Activity "${activityName}|${activityId}" completed, applet "${appletName}|${appletId}, ${logDates}"`,
    );

    if (flowId) {
      Logger.log(
        `[ConstructCompletionsService]: Flow "${flowId}" completed, applet "${appletName}|${appletId}, ${logDates}"`,
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
  ) {
    const logDates = this.getLogDates(evaluatedEndAt, availableTo);

    Logger.log(
      `[ConstructCompletionsService]: Activity "${activityName}|${activityId}" within flow "${flowName}|${flowId}" completed, applet "${appletName}|${appletId}, ${logDates}"`,
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

    return completionType === 'intermediate'
      ? availableTo
      : addMilliseconds(availableTo, DistinguishInterimAndFinishLag).getTime();
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
      Logger.warn(error);
      throw new Error(error);
    }
  }

  private isRecordExist(
    activityStorageRecord: ActivityState | null | undefined,
  ): boolean {
    if (!activityStorageRecord) {
      Logger.warn(
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

    const summaryAlerts: AnswerAlerts =
      PassSurveyModel.AlertsExtractor.extractForSummary(
        activityStorageRecord.items,
        activityStorageRecord.answers,
        activityName,
      );

    const scores: ScoreRecord[] = PassSurveyModel.ScoresExtractor.extract(
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
    Logger.log(
      '[ConstructCompletionsService.constructForIntermediate] input:\n' +
        JSON.stringify(input, null, 2),
    );

    const {
      appletId,
      flowId,
      activityId,
      eventId,
      order,
      activityName,
      isAutocompletion,
    } = input;

    const activityStorageRecord = getActivityRecord(
      appletId,
      activityId,
      eventId,
      order,
    )!;

    if (!this.isRecordExist(activityStorageRecord)) {
      return;
    }

    const { appletEncryption, appletName } = this.getAppletProperties(appletId);

    this.validateEncryption(appletEncryption);

    const { items, answers: recordAnswers, actions } = activityStorageRecord;

    await createSvgFiles(items, recordAnswers);

    if (activityStorageRecord.hasSummary) {
      this.addSummaryData(activityStorageRecord, input);
    }

    const answers = mapAnswersToDto(items, recordAnswers);

    const { itemIds: modifiedItemIds, answers: modifiedAnswers } =
      fillNullsForHiddenItems(
        getItemIds(items),
        answers,
        activityStorageRecord.context.originalItems as InitializeHiddenItem[],
      );

    const progressRecord = getEntityProgress(
      appletId,
      flowId,
      eventId,
      this.storeProgress,
    )!;

    const { flowName, scheduledDate } = getFlowRecord(
      flowId,
      appletId,
      eventId,
    )!;

    const evaluatedEndAt = this.evaluateEndAt(
      'intermediate',
      progressRecord.availableTo,
      isAutocompletion,
    );

    this.logIntermediate(
      input,
      flowName!,
      appletName,
      evaluatedEndAt,
      progressRecord.availableTo,
    );

    const submitId = getExecutionGroupKey(progressRecord);

    this.pushToQueueService.push({
      appletId,
      createdAt: evaluatedEndAt,
      version: activityStorageRecord.appletVersion,
      answers: modifiedAnswers,
      userActions: mapUserActionsToDto(actions),
      itemIds: modifiedItemIds,
      appletEncryption: appletEncryption!,
      flowId: flowId,
      activityId: activityId,
      executionGroupKey: submitId,
      userIdentifier: getUserIdentifier(items, recordAnswers),
      startTime: getActivityStartAt(progressRecord)!,
      endTime: evaluatedEndAt,
      scheduledTime: scheduledDate,
      logActivityName: activityName,
      logCompletedAt: getNow().toUTCString(),
      client: getClientInformation(),
      alerts: mapAnswersToAlerts(items, recordAnswers),
      eventId,
      isFlowCompleted: false,
      tzOffset: getTimezoneOffset(),
    });

    clearActivityStorageRecord(appletId, activityId, eventId, order);

    AnalyticsService.track(MixEvents.AssessmentCompleted, {
      [MixProperties.AppletId]: appletId,
      [MixProperties.SubmitId]: submitId,
    });

    Logger.log(
      `[ConstructCompletionsService.constructForIntermediate] Done, submitId=${submitId}, evaluatedEndAt=${new Date(evaluatedEndAt).toString()}`,
    );
  }

  private async constructForFinish(
    input: ConstructForFinishInput,
  ): Promise<void> {
    Logger.log(
      '[ConstructCompletionsService.constructForFinish] input:\n' +
        JSON.stringify(input, null, 2),
    );

    const {
      appletId,
      flowId,
      activityId,
      eventId,
      order,
      activityName,
      isAutocompletion,
    } = input;

    const entityId = flowId ? flowId : activityId;

    const activityStorageRecord = getActivityRecord(
      appletId,
      activityId,
      eventId,
      order,
    )!;

    if (!this.isRecordExist(activityStorageRecord)) {
      return;
    }

    const { appletEncryption, appletName } = this.getAppletProperties(appletId);

    this.validateEncryption(appletEncryption);

    const { items, answers: recordAnswers, actions } = activityStorageRecord;

    await createSvgFiles(items, recordAnswers);

    const alerts = mapAnswersToAlerts(items, recordAnswers);

    const answers = mapAnswersToDto(items, recordAnswers);

    const userIdentifier = getUserIdentifier(items, recordAnswers);

    const userActions = mapUserActionsToDto(actions);

    const itemIds = getItemIds(items);

    const { itemIds: modifiedItemIds, answers: modifiedAnswers } =
      fillNullsForHiddenItems(
        itemIds,
        answers,
        activityStorageRecord.context.originalItems as InitializeHiddenItem[],
      );

    const progressRecord = getEntityProgress(
      appletId,
      entityId,
      eventId,
      this.storeProgress,
    )!;

    const evaluatedEndAt = this.evaluateEndAt(
      'finish',
      progressRecord.availableTo,
      isAutocompletion,
    );

    this.logCompletion(
      activityName,
      activityId,
      flowId,
      appletName,
      appletId,
      evaluatedEndAt,
      progressRecord.availableTo,
    );

    const { scheduledDate } = getFlowRecord(flowId, appletId, eventId)!;

    const submitId = getExecutionGroupKey(progressRecord);

    this.pushToQueueService.push({
      appletId,
      createdAt: evaluatedEndAt,
      version: activityStorageRecord.appletVersion,
      answers: modifiedAnswers,
      userActions,
      itemIds: modifiedItemIds,
      appletEncryption: appletEncryption!,
      flowId: flowId ?? null,
      activityId,
      executionGroupKey: submitId,
      userIdentifier,
      startTime: getActivityStartAt(progressRecord)!,
      endTime: evaluatedEndAt,
      scheduledTime: scheduledDate,
      logActivityName: activityName,
      logCompletedAt: getNow().toUTCString(),
      client: getClientInformation(),
      alerts,
      eventId,
      isFlowCompleted: !!flowId,
      tzOffset: getTimezoneOffset(),
    });

    this.dispatch(
      AppletModel.actions.entityCompleted({
        appletId,
        eventId,
        entityId,
        endAt: evaluatedEndAt,
      }),
    );

    clearActivityStorageRecord(appletId, activityId, eventId, order);

    AnalyticsService.track(MixEvents.AssessmentCompleted, {
      [MixProperties.AppletId]: appletId,
      [MixProperties.SubmitId]: submitId,
    });

    Logger.log(
      `[ConstructCompletionsService.constructForFinish] Done, submitId=${submitId}, evaluatedEndAt=${new Date(evaluatedEndAt).toString()}`,
    );
  }

  public async construct(input: ConstructInput): Promise<void> {
    if (input.completionType === 'intermediate') {
      await this.constructForIntermediate({
        ...input,
        flowId: input.flowId!,
      });
    }

    if (input.completionType === 'finish') {
      await this.constructForFinish(input);
    }
  }
}
