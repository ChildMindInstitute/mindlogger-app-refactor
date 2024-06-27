/* eslint-disable no-nested-ternary */
import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { UploadProgressObservable } from '../';

import { useForceUpdate } from './';

type UseUploadProgressResult = {
  totalActivities: number;
  currentActivity: number;
  currentActivityName: string;
  totalFilesInActivity: number;
  currentFile: number;
  currentSecondLevelStep: string;
  isValid: boolean;
  currentStep: number | null; //1-based
  totalSteps: number | null;
};

const useUploadProgress = () => {
  const { t } = useTranslation();

  const update = useForceUpdate();

  const isValidReFiles =
    (UploadProgressObservable.totalFilesInActivity === 0 &&
      UploadProgressObservable.currentSecondLevelStep !== 'upload_files') ||
    (UploadProgressObservable.totalFilesInActivity > 0 &&
      UploadProgressObservable.currentFile >= 0);

  const {
    currentActivity,
    currentActivityName,
    currentFile,
    totalActivities,
    totalFilesInActivity,
  } = UploadProgressObservable;

  const progress: UseUploadProgressResult = {
    currentActivity,
    currentActivityName,
    currentFile,
    currentSecondLevelStep:
      UploadProgressObservable.currentSecondLevelStep === null
        ? ''
        : t(
            `activity:progress:${UploadProgressObservable.currentSecondLevelStep}`,
          ),
    totalActivities,
    totalFilesInActivity,
    isValid:
      UploadProgressObservable.currentActivity >= 0 &&
      isValidReFiles &&
      UploadProgressObservable.currentSecondLevelStep !== null,
    totalSteps: null,
    currentStep: null,
  };

  if (progress.isValid) {
    progress.totalSteps = UploadProgressObservable.totalFilesInActivity + 2;

    const isFileStepExist = UploadProgressObservable.totalFilesInActivity > 0;

    const fileStep: number = UploadProgressObservable.currentFile;

    const levelStep = UploadProgressObservable.currentSecondLevelStep;

    let twoLevelStep: number =
      levelStep === 'upload_files'
        ? 0
        : levelStep === 'encrypt_answers'
          ? 1
          : levelStep === 'upload_answers'
            ? 2
            : 0;

    if (!isFileStepExist) {
      twoLevelStep--;
    }

    progress.currentStep = (isFileStepExist ? fileStep : 0) + twoLevelStep + 1;
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
