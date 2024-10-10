import { useEffect } from 'react';

import { useForceUpdate } from './useForceUpdate';
import { getDefaultChangeQueueObservable } from '../observables/changeQueueObservableInstance';
import { getDefaultUploadObservable } from '../observables/uploadObservableInstance';

type Result = {
  isUploading: boolean;
  isError: boolean;
  isPostponed: boolean;
  isCompleted: boolean;
};

export const useUploadObservable = (): Result => {
  const update = useForceUpdate();

  useEffect(() => {
    const onChangeUploadState = () => {
      update();
    };

    const onChangeQueue = () => {
      update();
    };

    getDefaultUploadObservable().addObserver(onChangeUploadState);

    getDefaultChangeQueueObservable().addObserver(onChangeQueue);

    return () => {
      getDefaultUploadObservable().removeObserver(onChangeUploadState);

      getDefaultChangeQueueObservable().removeObserver(onChangeQueue);
    };
  }, [update]);

  return {
    isUploading: getDefaultUploadObservable().isLoading,
    isError: getDefaultUploadObservable().isError,
    isPostponed: getDefaultUploadObservable().isPostponed,
    isCompleted: getDefaultUploadObservable().isCompleted,
  };
};
