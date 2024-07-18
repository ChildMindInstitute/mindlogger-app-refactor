import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { UploadProgressObservable } from '../';
import { UploadProgress } from '../observables/uploadProgressObservable';

import { useForceUpdate } from './';

type UseUploadProgressResult = UploadProgress & {
  currentSecondLevelStep: string | null;
  currentStep: number | null;
  totalSteps: number | null;
  isValid: boolean;
};

const useUploadProgress = (): UseUploadProgressResult => {
  const { t } = useTranslation();

  const update = useForceUpdate();

  const {
    currentActivity,
    currentActivityName,
    currentFile,
    totalActivities,
    totalFilesInActivity,
    currentSecondLevelStepKey,
  } = UploadProgressObservable;

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
      currentActivity !== null &&
      currentSecondLevelStepKey !== null &&
      (totalFilesInActivity === 0 ||
        (totalFilesInActivity !== null &&
          currentFile !== null &&
          totalFilesInActivity > 0 &&
          currentFile >= 0)),
    totalSteps: null,
    currentStep: null,
  };

  if (progress.isValid) {
    const hasFiles = totalFilesInActivity! > 0;

    const hasFakeFileStep = !hasFiles;

    progress.totalSteps = hasFakeFileStep ? 3 : 2 + totalFilesInActivity!;

    const fileStep: number = currentFile!;

    const levelStep = currentSecondLevelStepKey;

    let currentStep = 0;

    if (hasFiles) {
      currentStep += fileStep;
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

    progress.currentStep = currentStep;
  }

  useEffect(() => {
    const onProgressChange = () => {
      update();
    };

    UploadProgressObservable.addObserver(onProgressChange);

    return () => {
      UploadProgressObservable.removeObserver(onProgressChange);
      UploadProgressObservable.reset();
    };
  }, [update]);

  return progress;
};

export default useUploadProgress;
