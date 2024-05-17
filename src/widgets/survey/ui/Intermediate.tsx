import { useCallback, useEffect } from 'react';

import { styled } from '@tamagui/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { EntityPathParams, StoreProgress } from '@app/abstract/lib';
import { useRetryUpload } from '@app/entities/activity';
import { QueueProcessingService } from '@app/entities/activity/lib';
import useQueueProcessing from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { AppletModel } from '@app/entities/applet';
import { QueryDataUtils } from '@app/shared/api';
import {
  InterimSubmitObservable,
  Logger,
  UploadObservable,
  useAppDispatch,
  useAppSelector,
} from '@app/shared/lib';
import { badge } from '@assets/images';
import { Center, YStack, Text, Button, Image, XStack } from '@shared/ui';

import { useFlowStorageRecord } from '../lib';
import {
  StepperPipelineItem,
  useAutoCompletion,
  useFlowStateActions,
} from '../model';
import { ConstructCompletionsService } from '../model/services/ConstructCompletionsService';

type Props = {
  appletId: string;
  activityId: string;
  activityName: string;
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
  activityName,
  eventId,
  order,
  onClose,
  onFinish,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { flowStorageRecord } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId,
  });

  const { saveActivitySummary } = useFlowStateActions({
    appletId,
    eventId,
    flowId,
  });

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const { step, pipeline, flowName } = flowStorageRecord!;

  const activitiesPassed = pipeline
    .slice(0, step)
    .filter(o => o.type === 'Stepper').length;

  const totalActivities = pipeline.filter(o => o.type === 'Stepper').length;

  const nextFlowItem = pipeline[step + 1];

  const nextActivityPayload = (nextFlowItem as StepperPipelineItem).payload;

  const {
    isCompleted,
    isPostponed,
    isLoading,
    isError,
    process: processQueue,
  } = useQueueProcessing();

  const { openAlert: openRetryAlert } = useRetryUpload({
    retryUpload: processQueue,
    onPostpone: () => {
      changeActivity();
      onFinish();
    },
    onSuccess: () => {
      changeActivity();
      onFinish();
    },
  });

  const { process: processWithAutocompletion } = useAutoCompletion();

  const getAppletName = useCallback(() => {
    return new QueryDataUtils(queryClient).getAppletDto(appletId)?.displayName;
  }, [appletId, queryClient]);

  const changeActivity = useCallback(() => {
    const appletName = getAppletName();

    Logger.log(
      `[Intermediate.changeActivity]: Activity "${activityName}|${activityId}" within flow "${flowName}|${flowId}" changed to next activity "${nextActivityPayload.activityName}|${nextActivityPayload.activityId}", applet "${appletName}|${appletId}"`,
    );

    dispatch(
      AppletModel.actions.flowUpdated({
        appletId,
        flowId,
        activityId: nextActivityPayload.activityId,
        activityName: nextActivityPayload.activityName,
        activityDescription: nextActivityPayload.activityDescription,
        activityImage: nextActivityPayload.activityImage,
        eventId,
        pipelineActivityOrder: activitiesPassed,
        totalActivities,
      }),
    );
  }, [
    appletId,
    dispatch,
    eventId,
    flowId,
    activitiesPassed,
    nextActivityPayload.activityId,
    nextActivityPayload.activityName,
    nextActivityPayload.activityDescription,
    nextActivityPayload.activityImage,
    totalActivities,
    activityName,
    activityId,
    flowName,
    getAppletName,
  ]);

  async function completeActivity() {
    InterimSubmitObservable.processing = true;

    const constructCompletionService = new ConstructCompletionsService(
      saveActivitySummary,
      queryClient,
      storeProgress,
      QueueProcessingService,
      dispatch,
    );

    await constructCompletionService.construct({
      activityId,
      activityName,
      appletId,
      eventId,
      flowId,
      order,
      completionType: 'intermediate',
      isAutocompletion: false,
    });

    const exclude: EntityPathParams = {
      appletId,
      entityId: flowId ?? activityId,
      eventId,
    };

    const success = await processWithAutocompletion(exclude);

    if (!success) {
      openRetryAlert();
    } else {
      queryClient.invalidateQueries(['activity_analytics']);
      changeActivity();
      onFinish();
    }
  }

  useEffect(() => {
    UploadObservable.reset();
    InterimSubmitObservable.reset();
  }, []);

  return (
    <YStack flex={1} mx={40} jc="center" bg="$white">
      <YStack space={25}>
        <Text textAlign="center" fontSize={16}>
          {t('additional:submit_flow_answers')}{' '}
          <Text fontWeight="bold">{t('additional:submit')}</Text>{' '}
          {t('additional:submit_flow_answers_ex')}
        </Text>

        <ActivityBox>
          <Text
            accessibilityLabel="next_activity-name"
            fontWeight="bold"
            mb={10}
            fontSize={16}
          >
            {nextActivityPayload.activityName}
          </Text>

          <XStack>
            <Image src={badge} width={18} height={18} opacity={0.6} r={4} />

            <Text fontSize={14} color="$grey">
              {activitiesPassed + 1} of {totalActivities} {flowName}
            </Text>
          </XStack>
        </ActivityBox>

        <YStack space={10}>
          <Button
            bg="$blue"
            accessibilityLabel="submit-button"
            onPress={completeActivity}
            isLoading={isLoading && !isCompleted && !isPostponed && !isError}
          >
            {t('change_study:submit')}
          </Button>

          <Text
            color="$blue"
            accessibilityLabel="back-button"
            textAlign="center"
            fontSize={17}
            fontWeight="bold"
            onPress={onClose}
            disabled={isLoading && !isCompleted && !isPostponed && !isError}
          >
            {t('activity_navigation:back')}
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
}

export default Intermediate;
