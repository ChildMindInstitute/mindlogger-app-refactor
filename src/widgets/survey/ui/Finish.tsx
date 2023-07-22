import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { StoreProgress } from '@app/abstract/lib';
import { useRetryUpload } from '@app/entities/activity/lib';
import useQueueProcessing from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { EventModel } from '@app/entities/event';
import { AppletModel, useAppletDetailsQuery } from '@entities/applet';
import { NotificationModel } from '@entities/notification';
import { PassSurveyModel } from '@features/pass-survey';
import { LogTrigger } from '@shared/api';
import {
  getUnixTimestamp,
  isAppOnline,
  useActivityInfo,
  useAppDispatch,
  useAppSelector,
} from '@shared/lib';
import { Center, ImageBackground, Text, Button } from '@shared/ui';

import {
  FinishReason,
  getActivityStartAt,
  getExecutionGroupKey,
  getItemIds,
  getScheduledDate,
  getUserIdentifier,
} from '../model';
import { mapAnswersToDto, mapUserActionsToDto } from '../model/mappers';

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

  const { activityStorageRecord, clearActivityStorageRecord } =
    PassSurveyModel.useActivityState({
      appletId,
      activityId,
      eventId,
      order,
    });

  const {
    isLoading: isUploading,
    process: processQueue,
    push: pushInQueue,
  } = useQueueProcessing();

  const { getName: getActivityName } = useActivityInfo();

  const { isAlertOpened: isRetryAlertOpened, openAlert: openRetryAlert } =
    useRetryUpload({
      retryUpload: processQueue,
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

    const answers = mapAnswersToDto(
      activityStorageRecord.items,
      activityStorageRecord.answers,
    );

    const userIdentifier = getUserIdentifier(
      activityStorageRecord.items,
      activityStorageRecord.answers,
    );

    const userActions = mapUserActionsToDto(activityStorageRecord.actions);

    const itemIds = getItemIds(
      activityStorageRecord.items,
      activityStorageRecord.answers,
    );

    const progressRecord = storeProgress[appletId][entityId][eventId];

    const scheduledDate = getScheduledDate(scheduledEvent!);

    const executionGroupKey = getExecutionGroupKey(progressRecord);

    const scheduledTime = scheduledDate && getUnixTimestamp(scheduledDate);

    pushInQueue({
      appletId,
      createdAt: getUnixTimestamp(Date.now()),
      version: activityStorageRecord.appletVersion,
      answers: answers,
      userActions,
      itemIds,
      appletEncryption,
      flowId: flowId ?? null,
      activityId: activityId,
      executionGroupKey,
      userIdentifier,
      startTime: getUnixTimestamp(getActivityStartAt(progressRecord)!),
      endTime: getUnixTimestamp(Date.now()),
      scheduledTime,
      debug_activityName: getActivityName(activityId),
      debug_completedAt: new Date().toString(),
    });

    clearActivityStorageRecord();

    const online = await isAppOnline();

    if (!online) {
      return;
    }

    const success = await processQueue();

    if (!success) {
      openRetryAlert();
    }
  }

  useEffect(() => {
    completeActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCloseEntity = () => {
    NotificationModel.NotificationRefreshService.refresh(
      queryClient,
      storeProgress,
      LogTrigger.EntityCompleted,
    );
    onClose();
  };

  if (isUploading) {
    return (
      <ImageBackground>
        <Center flex={1} mx={16}>
          <Text fontSize={22}>Please Wait ...</Text>
        </Center>
      </ImageBackground>
    );
  }

  if (isRetryAlertOpened) {
    return <ImageBackground />;
  }

  return (
    <ImageBackground>
      <Center flex={1} mx={16}>
        <Text fontSize={24} fontWeight="bold">
          {finishReason === 'regular' && t('additional:thanks')}
          {finishReason === 'time-is-up' && t('additional:time-end')}
        </Text>

        <Text fontSize={16} mb={20}>
          {t('additional:saved_answers')}
        </Text>

        <Button onPress={onCloseEntity}>{t('additional:close')}</Button>
      </Center>
    </ImageBackground>
  );
}

export default FinishItem;
