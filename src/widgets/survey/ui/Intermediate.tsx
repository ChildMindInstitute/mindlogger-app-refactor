import { useCallback, useEffect } from 'react';

import { styled } from '@tamagui/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { StoreProgress } from '@app/abstract/lib';
import { useRetryUpload } from '@app/entities/activity';
import { UploadObservable } from '@app/entities/activity/lib';
import useQueueProcessing from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { useAppletDetailsQuery, AppletModel } from '@app/entities/applet';
import {
  AnswerAlerts,
  PassSurveyModel,
  ScoreRecord,
} from '@app/features/pass-survey';
import { InitializeHiddenItem } from '@app/features/pass-survey/model';
import {
  Logger,
  useAppDispatch,
  useAppSelector,
  getTimezoneOffset,
} from '@app/shared/lib';
import { badge } from '@assets/images';
import { Center, YStack, Text, Button, Image, XStack } from '@shared/ui';

import { getClientInformation } from '../lib';
import { useFlowStorageRecord } from '../lib';
import {
  StepperPipelineItem,
  createSvgFiles,
  fillNullsForHiddenItems,
  getActivityStartAt,
  getExecutionGroupKey,
  getItemIds,
  getUserIdentifier,
  mapAnswersToAlerts,
  mapAnswersToDto,
  mapUserActionsToDto,
  useFlowStateActions,
} from '../model';

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

  const { data: appletData } = useAppletDetailsQuery(appletId, {
    select: response => {
      const appletDetails = AppletModel.mapAppletDetailsFromDto(
        response.data.result,
      );
      return {
        encryption: appletDetails.encryption,
        appletName: appletDetails.displayName,
      };
    },
  });

  const appletEncryption = appletData?.encryption || null;
  const appletName = appletData?.appletName;

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

  const { step, pipeline, flowName, scheduledDate } = flowStorageRecord!;

  const activitiesPassed = pipeline
    .slice(0, step)
    .filter(o => o.type === 'Stepper').length;

  const totalActivities = pipeline.filter(o => o.type === 'Stepper').length;

  const nextFlowItem = pipeline[step + 1];

  const nextActivityPayload = (nextFlowItem as StepperPipelineItem).payload;

  const progressRecord = storeProgress[appletId][flowId][eventId];

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
    isLoading,
    isError,
    process: processQueue,
    push: pushInQueue,
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

  const changeActivity = useCallback(() => {
    Logger.log(
      `[Intermediate.completeActivity]: Activity "${activityName}|${activityId}" within flow "${flowName}|${flowId}" changed to next activity "${nextActivityPayload.activityName}|${nextActivityPayload.activityId}", applet "${appletName}|${appletId}"`,
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
    appletName,
  ]);

  async function completeActivity() {
    if (!activityStorageRecord) {
      return;
    }

    if (!appletEncryption) {
      throw new Error('Encryption params is undefined');
    }

    await createSvgFiles(
      activityStorageRecord.items,
      activityStorageRecord.answers,
    );

    if (activityStorageRecord.hasSummary) {
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

      saveActivitySummary({
        activityId,
        order,
        alerts: summaryAlerts,
        scores: {
          activityName,
          scores,
        },
      });
    }

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

    const userActions = mapUserActionsToDto(activityStorageRecord.actions);

    const itemIds = getItemIds(activityStorageRecord.items);

    const { itemIds: modifiedItemIds, answers: modifiedAnswers } =
      fillNullsForHiddenItems(itemIds, answers, originalItems);

    const executionGroupKey = getExecutionGroupKey(progressRecord);

    const userIdentifier = getUserIdentifier(
      activityStorageRecord.items,
      activityStorageRecord.answers,
    );

    Logger.log(
      `[Intermediate.completeActivity]: Activity "${activityName}|${activityId}" within flow "${flowName}|${flowId}" completed, applet "${appletName}|${appletId}"`,
    );

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
      scheduledTime: scheduledDate ?? undefined,
      logActivityName: activityName,
      logCompletedAt: new Date().toString(),
      client: getClientInformation(),
      alerts,
      eventId,
      isFlowCompleted: false,
      tzOffset: getTimezoneOffset(),
    });

    clearActivityStorageRecord();

    const success = await processQueue();

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
