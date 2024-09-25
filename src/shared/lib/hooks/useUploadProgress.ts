import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { useForceUpdate } from './useForceUpdate';
import {
  SecondLevelStep,
  UploadProgress,
} from '../observables/IUploadProgressObservable';
import { getDefaultUploadProgressObservable } from '../observables/uploadProgressObservableInstance';

type UseUploadProgressResult = UploadProgress & {
  currentSecondLevelStep: string | null;
  currentStep: number | null;
  totalSteps: number | null;
  isValid: boolean;
};

const evaluateCurrentStep = (
  hasFiles: boolean,
  currentSecondLevelStepKey: SecondLevelStep,
  currentFileStep: number | null,
): number => {
  const levelStep = currentSecondLevelStepKey;

  let currentStep = 0;

  if (hasFiles) {
    currentStep += currentFileStep!;
  }

  if (levelStep === 'encrypt_answers') {
    currentStep += 1;
  }

  if (levelStep === 'upload_answers') {
    currentStep += 2;
  }

  if (levelStep === 'completed') {
    currentStep += 3;
  }

  return currentStep;
};

export const useUploadProgress = (): UseUploadProgressResult => {
  const { t } = useTranslation();

  const update = useForceUpdate();

  const {
    currentActivity,
    currentActivityName,
    currentFile,
    totalActivities,
    totalFilesInActivity,
    currentSecondLevelStepKey,
  } = getDefaultUploadProgressObservable();

  const isActivityUploadStarted: boolean =
    currentActivity !== null && currentSecondLevelStepKey !== null;

  const isFileUploadStarted: boolean =
    totalFilesInActivity !== null &&
    currentFile !== null &&
    totalFilesInActivity > 0 &&
    currentFile >= 0;

  const progress: UseUploadProgressResult = {
    currentActivity,
    currentActivityName,
    currentFile,
    currentSecondLevelStepKey,
    currentSecondLevelStep:
      currentSecondLevelStepKey === null
        ? ''
        : t(`activity:progress:${currentSecondLevelStepKey}`),
    totalActivities,
    totalFilesInActivity,
    isValid:
      isActivityUploadStarted &&
      (totalFilesInActivity === 0 || isFileUploadStarted),
    totalSteps: null,
    currentStep: null,
  };

  if (progress.isValid) {
    const hasFiles = totalFilesInActivity! > 0;

    const hasFakeFileStep = !hasFiles;

    progress.totalSteps = hasFakeFileStep ? 3 : 2 + totalFilesInActivity!;

    progress.currentStep = evaluateCurrentStep(
      hasFiles,
      currentSecondLevelStepKey!,
      currentFile,
    );
  }

  useEffect(() => {
    const onProgressChange = () => {
      update();
    };

    getDefaultUploadProgressObservable().addObserver(onProgressChange);

    return () => {
      getDefaultUploadProgressObservable().removeObserver(onProgressChange);
      getDefaultUploadProgressObservable().reset();
    };
  }, [update]);

  return progress;
};
