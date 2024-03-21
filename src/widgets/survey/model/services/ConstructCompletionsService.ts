import { QueryClient } from '@tanstack/react-query';

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
};

type ConstructForFinishInput = {
  appletId: string;
  activityId: string;
  flowId: string | undefined;
  eventId: string;
  order: number;
  activityName: string;
};

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

  private logCompletion(
    activityName: string,
    activityId: string,
    flowId: string | undefined,
    appletName: string,
    appletId: string,
  ) {
    Logger.log(
      `[ConstructCompletionsService]: Activity "${activityName}|${activityId}" completed, applet "${appletName}|${appletId}"`,
    );

    if (flowId) {
      Logger.log(
        `[ConstructCompletionsService]: Flow "${flowId}" completed, applet "${appletName}|${appletId}"`,
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
  ) {
    Logger.log(
      `[ConstructCompletionsService]: Activity "${activityName}|${activityId}" within flow "${flowName}|${flowId}" completed, applet "${appletName}|${appletId}"`,
    );
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

  private validate(
    activityStorageRecord: ActivityState | null | undefined,
    appletEncryption: AppletEncryptionDTO | null | undefined,
  ) {
    if (!activityStorageRecord) {
      const error =
        '[ConstructCompletionsService] activityStorageRecord does not exist';
      Logger.warn(error);
      throw new Error(error);
    }

    if (!appletEncryption) {
      const error =
        '[ConstructCompletionsService] Encryption params is undefined';
      Logger.warn(error);
      throw new Error(error);
    }
  }

  private addSummaryData(
    activityStorageRecord: ActivityState,
    { activityName, activityId, order }: ConstructForIntermediateInput,
  ) {
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

    this.saveActivitySummary!({
      activityId,
      order,
      alerts: summaryAlerts,
      scores: {
        activityName,
        scores,
      },
    });
  }

  public async constructForIntermediate(
    input: ConstructForIntermediateInput,
  ): Promise<void> {
    Logger.log(
      '[ConstructCompletionsService.constructForIntermediate] input:\n' +
        JSON.stringify(input, null, 2),
    );

    const { appletId, flowId, activityId, eventId, order, activityName } =
      input;

    const activityStorageRecord = getActivityRecord(
      appletId,
      activityId,
      eventId,
      order,
    )!;

    const { appletEncryption, appletName } = this.getAppletProperties(appletId);

    this.validate(activityStorageRecord, appletEncryption);

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

    const progressRecord = this.storeProgress[appletId][flowId][eventId];

    const { flowName, scheduledDate } = getFlowRecord(
      flowId,
      appletId,
      eventId,
    )!;

    this.logIntermediate(input, flowName!, appletName);

    this.pushToQueueService.push({
      appletId,
      createdAt: Date.now(),
      version: activityStorageRecord.appletVersion,
      answers: modifiedAnswers,
      userActions: mapUserActionsToDto(actions),
      itemIds: modifiedItemIds,
      appletEncryption: appletEncryption!,
      flowId: flowId ?? null,
      activityId: activityId,
      executionGroupKey: getExecutionGroupKey(progressRecord),
      userIdentifier: getUserIdentifier(items, recordAnswers),
      startTime: getActivityStartAt(progressRecord)!,
      endTime: Date.now(),
      scheduledTime: scheduledDate ?? undefined,
      logActivityName: activityName,
      logCompletedAt: new Date().toString(),
      client: getClientInformation(),
      alerts: mapAnswersToAlerts(items, recordAnswers),
      eventId,
      isFlowCompleted: false,
    });

    clearActivityStorageRecord(appletId, activityId, eventId, order);
  }

  public async constructForFinish(
    input: ConstructForFinishInput,
  ): Promise<void> {
    Logger.log(
      '[ConstructCompletionsService.constructForFinish] input:\n' +
        JSON.stringify(input, null, 2),
    );

    const { appletId, flowId, activityId, eventId, order, activityName } =
      input;

    const entityId = flowId ? flowId : activityId;

    const { appletEncryption, appletName } = this.getAppletProperties(appletId);

    const activityStorageRecord = getActivityRecord(
      appletId,
      activityId,
      eventId,
      order,
    )!;

    this.validate(activityStorageRecord, appletEncryption);

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

    const progressRecord = this.storeProgress[appletId][entityId][eventId];

    this.logCompletion(activityName, activityId, flowId, appletName, appletId);

    const { scheduledDate } = getFlowRecord(flowId, appletId, eventId)!;

    this.pushToQueueService.push({
      appletId,
      createdAt: Date.now(),
      version: activityStorageRecord.appletVersion,
      answers: modifiedAnswers,
      userActions,
      itemIds: modifiedItemIds,
      appletEncryption: appletEncryption!,
      flowId: flowId ?? null,
      activityId,
      executionGroupKey: getExecutionGroupKey(progressRecord),
      userIdentifier,
      startTime: getActivityStartAt(progressRecord)!,
      endTime: Date.now(),
      scheduledTime: scheduledDate ?? undefined,
      logActivityName: activityName,
      logCompletedAt: new Date().toString(),
      client: getClientInformation(),
      alerts,
      eventId,
      isFlowCompleted: !!flowId,
    });

    this.dispatch(
      AppletModel.actions.entityCompleted({
        appletId,
        eventId,
        entityId,
      }),
    );

    clearActivityStorageRecord(appletId, activityId, eventId, order);

    AnalyticsService.track(MixEvents.AssessmentCompleted, {
      [MixProperties.AppletId]: appletId,
    });
  }
}
