import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { StoreProgress } from '@app/abstract/lib';
import { UploadObservable, useRetryUpload } from '@app/entities/activity/lib';
import useQueueProcessing from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { EventModel } from '@app/entities/event';
import { InitializeHiddenItem } from '@app/features/pass-survey/model';
import { AppletModel, useAppletDetailsQuery } from '@entities/applet';
import { NotificationModel } from '@entities/notification';
import { PassSurveyModel } from '@features/pass-survey';
import { LogTrigger } from '@shared/api';
import {
  Logger,
  AnalyticsService,
  useActivityInfo,
  useAppDispatch,
  useAppSelector,
  MixProperties,
} from '@shared/lib';
import { Center, ImageBackground, Text, Button } from '@shared/ui';

import { getClientInformation } from '../lib';
import {
  createSvgFiles,
  fillNullsForHiddenItems,
  FinishReason,
  getActivityStartAt,
  getExecutionGroupKey,
  getItemIds,
  getScheduledDate,
  getUserIdentifier,
} from '../model';
import {
  mapAnswersToAlerts,
  mapAnswersToDto,
  mapUserActionsToDto,
} from '../model/mappers';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  flowId?: string;
  order: number;
  isTimerElapsed: boolean;

  onClose: () => void;
};

function FinishItem({
  flowId,
  appletId,
  activityId,
  eventId,
  order,
  isTimerElapsed,
  onClose,
}: Props) {
  const { t } = useTranslation();

  const { data: applet } = useAppletDetailsQuery(appletId, {
    select: response =>
      AppletModel.mapAppletDetailsFromDto(response.data.result),
  });

  const entityId = flowId ? flowId : activityId;

  const scheduledEvent = EventModel.useScheduledEvent({ appletId, eventId });

  const appletEncryption = applet?.encryption || null;

  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const completions = useAppSelector(AppletModel.selectors.selectCompletions);

  const { activityStorageRecord, clearActivityStorageRecord } =
    PassSurveyModel.useActivityState({
      appletId,
      activityId,
      eventId,
      order,
    });

  const {
    isCompleted,
    isPostponed,
    isError,
    process: processQueue,
    push: pushInQueue,
  } = useQueueProcessing();

  const { getName: getActivityName } = useActivityInfo();

  const { isAlertOpened: isRetryAlertOpened, openAlert: openRetryAlert } =
    useRetryUpload({
      retryUpload: processQueue,
      appletId,
    });

  let finishReason: FinishReason = isTimerElapsed ? 'time-is-up' : 'regular';

  async function completeActivity() {
    dispatch(
      AppletModel.actions.entityCompleted({
        appletId,
        eventId,
        entityId: flowId ? flowId : activityId,
      }),
    );

    if (!appletEncryption) {
      throw new Error('Encryption params is undefined');
    }

    if (!activityStorageRecord) {
      return;
    }

    await createSvgFiles(
      activityStorageRecord.items,
      activityStorageRecord.answers,
    );

    const alerts = mapAnswersToAlerts(
      activityStorageRecord.items,
      activityStorageRecord.answers,
    );

    const originalItems = activityStorageRecord.context
      .originalItems as InitializeHiddenItem[];

    const answers = mapAnswersToDto(
      activityStorageRecord.items,
      activityStorageRecord.answers,
    );

    const userIdentifier = getUserIdentifier(
      activityStorageRecord.items,
      activityStorageRecord.answers,
    );

    const userActions = mapUserActionsToDto(activityStorageRecord.actions);

    const itemIds = getItemIds(activityStorageRecord.items);

    const { itemIds: modifiedItemIds, answers: modifiedAnswers } =
      fillNullsForHiddenItems(itemIds, answers, originalItems);

    const progressRecord = storeProgress[appletId][entityId][eventId];

    const scheduledDate = getScheduledDate(scheduledEvent!);

    const executionGroupKey = getExecutionGroupKey(progressRecord);

    const logActivityName = getActivityName(activityId);

    const appletName = applet?.displayName;

    Logger.log(
      `[Finish.completeActivity]: Activity "${logActivityName}|${activityId}" completed, applet "${appletName}|${appletId}"`,
    );

    if (flowId) {
      Logger.log(
        `[Finish.completeActivity]: Flow "${flowId}" completed, applet "${appletName}|${appletId}"`,
      );
    }

    pushInQueue({
      appletId,
      createdAt: Date.now(),
      version: activityStorageRecord.appletVersion,
      answers: modifiedAnswers,
      userActions,
      itemIds: modifiedItemIds,
      appletEncryption,
      flowId: flowId ?? null,
      activityId: activityId,
      executionGroupKey,
      userIdentifier,
      startTime: getActivityStartAt(progressRecord)!,
      endTime: Date.now(),
      scheduledTime: scheduledDate,
      logActivityName,
      logCompletedAt: new Date().toString(),
      client: getClientInformation(),
      alerts,
      eventId,
      isFlowCompleted: !!flowId,
    });

    clearActivityStorageRecord();

    AnalyticsService.track('Assessment completed', {
      [MixProperties.AppletId]: appletId,
    });

    const success = await processQueue();

    if (!success) {
      openRetryAlert();
    } else {
      queryClient.invalidateQueries(['activity_analytics']);
    }
  }

  useEffect(() => {
    UploadObservable.reset();
    setTimeout(() => {
      completeActivity();
    }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCloseEntity = () => {
    NotificationModel.NotificationRefreshService.refresh(
      queryClient,
      storeProgress,
      completions,
      LogTrigger.EntityCompleted,
    );
    onClose();
  };

  if (isRetryAlertOpened) {
    return <ImageBackground />;
  }

  if (!isCompleted && !isPostponed && !isError) {
    return (
      <ImageBackground>
        <Center flex={1} mx={16}>
          <Text fontSize={22}>{t('activity:please_wait')}...</Text>
        </Center>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground>
      <Center flex={1} mx={16}>
        <Center accessibilityLabel="answer_saved-label">
          <Text
            fontSize={24}
            accessibilityLabel="answer_saved-title"
            fontWeight="bold"
          >
            {finishReason === 'regular' && t('additional:thanks')}
            {finishReason === 'time-is-up' && t('additional:time-end')}
          </Text>

          <Text
            fontSize={16}
            mb={20}
            accessibilityLabel="answer_saved-description"
          >
            {t('additional:saved_answers')}
          </Text>
        </Center>

        <Button accessibilityLabel="close-button" onPress={onCloseEntity}>
          {t('additional:close')}
        </Button>
      </Center>
    </ImageBackground>
  );
}

export default FinishItem;
