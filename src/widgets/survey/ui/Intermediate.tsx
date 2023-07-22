import { useCallback } from 'react';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { StoreProgress } from '@app/abstract/lib';
import { useRetryUpload } from '@app/entities/activity';
import useQueueProcessing from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { useAppletDetailsQuery, AppletModel } from '@app/entities/applet';
import {
  mapActivitiesFromDto,
  mapActivityFlowFromDto,
} from '@app/entities/applet/model';
import { EventModel } from '@app/entities/event';
import { PassSurveyModel } from '@app/features/pass-survey';
import {
  getUnixTimestamp,
  isAppOnline,
  useActivityInfo,
  useAppDispatch,
  useAppSelector,
} from '@app/shared/lib';
import { badge } from '@assets/images';
import { Center, YStack, Text, Button, Image, XStack } from '@shared/ui';

import { useFlowStorageRecord } from '../lib';
import {
  getActivityStartAt,
  getExecutionGroupKey,
  getItemIds,
  getScheduledDate,
  getUserIdentifier,
  mapAnswersToDto,
  mapUserActionsToDto,
} from '../model';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  flowId: string;
  order: number;

  onClose: () => void;
  onFinish: () => void;
};

const ActivityBox = styled(Center, {
  padding: 25,
  mx: 20,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$grey',
});

function Intermediate({
  flowId,
  appletId,
  activityId,
  eventId,
  order,
  onClose,
  onFinish,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // TODO: The usage of useAppletDetailsQuery here should be removed in the future
  // because we should rely on the flow pipeline instead.
  // https://github.com/ChildMindInstitute/mindlogger-app-refactor/pull/172#discussion_r1178961244
  let { data: activityFlow } = useAppletDetailsQuery(appletId, {
    select: response =>
      mapActivityFlowFromDto(
        response.data.result.activityFlows.find(o => o.id === flowId)!,
      ),
  });

  let { data: allActivities } = useAppletDetailsQuery(appletId, {
    select: r => mapActivitiesFromDto(r.data.result.activities),
  });

  const { data: applet } = useAppletDetailsQuery(appletId, {
    select: response =>
      AppletModel.mapAppletDetailsFromDto(response.data.result),
  });

  const appletEncryption = applet?.encryption || null;

  const { flowStorageRecord } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId,
  });

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const { step, pipeline } = flowStorageRecord!;

  const nextFlowItem = pipeline[step + 1];

  const activitiesPassed = pipeline
    .slice(0, step)
    .filter(o => o.type === 'Stepper').length;

  const totalActivities = activityFlow!.activityIds.length;

  const nextActivityId = nextFlowItem.payload.activityId;

  const nextActivity = allActivities?.find(x => x.id === nextActivityId);

  const entityId = flowId ? flowId : activityId;

  const scheduledEvent = EventModel.useScheduledEvent({ appletId, eventId });

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

  const { isAlertOpened: isRetryAlertOpened, openAlert: openRetryAlert } =
    useRetryUpload({
      retryUpload: processQueue,
      postpone: () => {
        changeActivity();
        onFinish();
      },
      success: () => {
        changeActivity();
        onFinish();
      },
    });

  const { getName: getActivityName } = useActivityInfo();

  const changeActivity = useCallback(() => {
    if (!nextActivity) {
      return;
    }

    dispatch(
      AppletModel.actions.flowUpdated({
        appletId,
        flowId,
        activityId: nextActivity.id,
        eventId,
        pipelineActivityOrder: activitiesPassed,
      }),
    );
  }, [appletId, dispatch, eventId, flowId, nextActivity, activitiesPassed]);

  async function completeActivity() {
    if (!activityStorageRecord) {
      return;
    }

    if (!appletEncryption) {
      throw new Error('Encryption params is undefined');
    }

    const answers = mapAnswersToDto(
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

    const userIdentifier = getUserIdentifier(
      activityStorageRecord.items,
      activityStorageRecord.answers,
    );

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
      scheduledTime: scheduledDate,
      debug_activityName: getActivityName(activityId),
      debug_completedAt: new Date().toString(),
    });

    clearActivityStorageRecord();

    const online = await isAppOnline();

    if (!online) {
      changeActivity();
      onFinish();
      return;
    }

    const success = await processQueue();

    if (!success) {
      openRetryAlert();
    } else {
      changeActivity();
      onFinish();
    }
  }

  return (
    <YStack flex={1} mx={40} jc="center" bg="$white">
      <YStack space={25}>
        <Text textAlign="center" fontSize={16}>
          {t('additional:submit_flow_answers')}{' '}
          <Text fontWeight="bold">{t('additional:submit')}</Text>{' '}
          {t('additional:submit_flow_answers_ex')}
        </Text>

        <ActivityBox>
          <Text fontWeight="bold" mb={10} fontSize={16}>
            {nextActivity?.name ?? 'Activity'}
          </Text>

          <XStack>
            <Image src={badge} width={18} height={18} opacity={0.6} r={4} />

            <Text fontSize={14} color="$grey">
              {activitiesPassed + 1} of {totalActivities} {activityFlow!.name}
            </Text>
          </XStack>
        </ActivityBox>

        <YStack space={10}>
          <Button
            bg="$blue"
            onPress={completeActivity}
            isLoading={isUploading || isRetryAlertOpened}
          >
            {t('change_study:submit')}
          </Button>

          <Text
            color="$blue"
            textAlign="center"
            fontSize={17}
            fontWeight="bold"
            onPress={onClose}
            disabled={isUploading || isRetryAlertOpened}
          >
            {t('activity_navigation:back')}
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
}

export default Intermediate;
