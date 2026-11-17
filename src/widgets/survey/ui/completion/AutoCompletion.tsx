import { FC, useEffect, useRef } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useQueueProcessing } from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { useRetryUpload } from '@app/entities/activity/lib/hooks/useRetryUpload';
import { getDefaultUploadObservable } from '@app/shared/lib/observables/uploadObservableInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { AnswersSubmitted } from './AnswersSubmitted';
import { SubScreenContainer } from './containers';
import { ProcessingAnswers } from './ProcessingAnswers';
import { useAutoCompletion } from '../../model/hooks/useAutoCompletion';

export const AutoCompletion: FC = () => {
  // Keep the navigation object so we can listen for focus/blur below.
  const navigation = useNavigation();
  const { goBack } = navigation;
  const { isCompleted, process: processQueue } = useQueueProcessing();

  const { isAlertOpened: isRetryAlertOpen, openAlert: openRetryAlert } =
    useRetryUpload({
      retryUpload: async () => {
        const retryResult = await processQueue();

        if (getDefaultUploadObservable().isPostponed) {
          goBack();
        }

        return retryResult;
      },
      onPostpone: goBack,
    });

  // evaluateIfItemsInQueueExist tells us on refocus whether anything is still waiting to upload.
  const { process: processWithAutocompletion, evaluateIfItemsInQueueExist } =
    useAutoCompletion();

  const processAnswers = async () => {
    const success = await processWithAutocompletion();

    if (getDefaultUploadObservable().isPostponed) {
      goBack();
    }

    if (!success) {
      openRetryAlert();
    }
  };

  useEffect(() => {
    processAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep refs in sync so the focus listener always calls the latest versions.
  const processAnswersRef = useRef(processAnswers);
  // Refreshed every render, so the listener never uses a stale closure.
  processAnswersRef.current = processAnswers;

  // Same idea for the queue check, so it reads the current queue state.
  const evaluateIfItemsInQueueExistRef = useRef(evaluateIfItemsInQueueExist);
  evaluateIfItemsInQueueExistRef.current = evaluateIfItemsInQueueExist;

  // Another screen can be opened on top of this one, e.g. an activity started
  // from a notification tap. That screen resets the shared upload status, so
  // when this screen is revealed again it would wait forever for a status that
  // never comes. Leave if the queue is already empty, otherwise upload again.
  useEffect(() => {
    // True only after another screen covered this one; tells "revealed again" apart from the first focus.
    let wasBlurred = false;

    // Blur fires when another screen is pushed on top of this one.
    const removeBlurListener = navigation.addListener('blur', () => {
      wasBlurred = true;
    });

    // Focus fires when this screen is visible again, including on first mount.
    const removeFocusListener = navigation.addListener('focus', () => {
      // First focus on mount: the mount effect above already started the upload.
      if (!wasBlurred) {
        return;
      }
      // Reset so the next cover/reveal cycle is detected the same way.
      wasBlurred = false;

      // Nothing left to upload, so there's no status coming; leave instead of spinning.
      if (!evaluateIfItemsInQueueExistRef.current()) {
        getDefaultLogger().log(
          '[AutoCompletion] Refocused with an empty queue, closing',
        );
        goBack();
        return;
      }

      getDefaultLogger().log(
        '[AutoCompletion] Refocused with items in the queue, processing again',
      );
      // Items are still queued: upload again so this screen gets a fresh status.
      processAnswersRef.current().catch((error: unknown) => {
        getDefaultLogger().warn(
          `[AutoCompletion] Processing on refocus failed: ${String(error)}`,
        );
      });
    });

    // Remove both listeners when the screen unmounts.
    return () => {
      removeBlurListener();
      removeFocusListener();
    };
  }, [navigation, goBack]);

  if (isRetryAlertOpen) {
    return <SubScreenContainer />;
  }

  if (isCompleted) {
    return (
      <SubScreenContainer>
        <AnswersSubmitted onPressDone={goBack} />
      </SubScreenContainer>
    );
  }

  return (
    <SubScreenContainer>
      <ProcessingAnswers />
    </SubScreenContainer>
  );
};
