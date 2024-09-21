import { useCallback, useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { EntityPathParams } from '@app/abstract/lib';
import { useRetryUpload } from '@app/entities/activity';
import {
  QueueProcessingService,
  useQueueProcessing,
} from '@app/entities/activity/lib';
import { AppletModel } from '@app/entities/applet';
import { QueryDataUtils } from '@app/shared/api';
import {
  InterimSubmitMutex,
  Logger,
  UploadObservable,
  useAppDispatch,
  useAppSelector,
} from '@app/shared/lib';

import { SubScreenContainer } from './completion/containers';
import IntermediateSubmit from './completion/IntermediateSubmit';
import ProcessingAnswers from './completion/ProcessingAnswers';
import { activityRecordExists, useFlowStorageRecord } from '../lib';
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
  targetSubjectId: string | null;
  order: number;

  onClose: () => void;
  onFinish: () => void;
};

function Intermediate({
  flowId,
  appletId,
  activityId,
  activityName,
  eventId,
  targetSubjectId,
  order,
  onClose,
  onFinish,
}: Props) {
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const [isSubmitPressed, setIsSubmitPressed] = useState(false);

  const { flowStorageRecord } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId,
    targetSubjectId,
  });

  const { saveActivitySummary } = useFlowStateActions({
    appletId,
    eventId,
    flowId,
    targetSubjectId,
  });

  const entityProgressions = useAppSelector(
    AppletModel.selectors.selectAppletsEntityProgressions,
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

  const { openAlert: openRetryAlert, isAlertOpened: isRetryAlertOpened } =
    useRetryUpload({
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

  const activityRecordRemoved = useMemo(
    () =>
      !activityRecordExists(
        appletId,
        activityId,
        eventId,
        targetSubjectId,
        order,
      ),
    [activityId, appletId, eventId, targetSubjectId, order],
  );

  const canNotGoBack =
    activityRecordRemoved ||
    (isLoading && !isCompleted && !isPostponed && !isError);

  const changeActivity = useCallback(() => {
    const appletName = getAppletName();

    Logger.log(
      `[Intermediate.changeActivity]: Activity "${activityName}|${activityId}" within flow "${flowName}|${flowId}" changed to next activity "${nextActivityPayload.activityName}|${nextActivityPayload.activityId}", applet "${appletName}|${appletId}"`,
    );

    dispatch(
      AppletModel.actions.updateFlow({
        appletId,
        flowId,
        targetSubjectId,
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
    targetSubjectId,
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
    InterimSubmitMutex.setBusy();

    const constructCompletionService = new ConstructCompletionsService(
      saveActivitySummary,
      queryClient,
      QueueProcessingService,
      dispatch,
      entityProgressions,
    );

    await constructCompletionService.construct({
      activityId,
      activityName,
      appletId,
      eventId,
      flowId,
      targetSubjectId,
      order,
      completionType: 'intermediate',
      isAutocompletion: false,
    });

    const exclude: EntityPathParams = {
      appletId,
      entityId: flowId ?? activityId,
      eventId,
      targetSubjectId,
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

    return () => {
      InterimSubmitMutex.release();
    };
  }, []);

  const isQueueProcessing =
    isLoading && !isCompleted && !isPostponed && !isError;

  if (isRetryAlertOpened) {
    return <SubScreenContainer />;
  }

  if (isQueueProcessing) {
    return (
      <SubScreenContainer>
        <ProcessingAnswers />
      </SubScreenContainer>
    );
  }

  return (
    <IntermediateSubmit
      activityName={nextActivityPayload.activityName}
      activitiesPassed={activitiesPassed}
      totalActivities={totalActivities}
      flowName={flowName!}
      onPressSubmit={() => {
        setIsSubmitPressed(true);
        completeActivity();
      }}
      isBackDisabled={canNotGoBack}
      onPressBack={onClose}
      isLoading={isSubmitPressed}
    />
  );
}

export default Intermediate;
