import { useEffect } from 'react';

import {
  ChangeQueueObservable,
  UploadObservable,
  useForceUpdate,
} from '@app/shared/lib';

type Result = {
  isUploading: boolean;
  isError: boolean;
  isPostponed: boolean;
  isCompleted: boolean;
};

const useUploadObservable = (): Result => {
  const update = useForceUpdate();

  useEffect(() => {
    const onChangeUploadState = () => {
      update();
    };

    const onChangeQueue = () => {
      update();
    };

    UploadObservable.addObserver(onChangeUploadState);

    ChangeQueueObservable.addObserver(onChangeQueue);

    return () => {
      UploadObservable.removeObserver(onChangeUploadState);

      ChangeQueueObservable.removeObserver(onChangeQueue);
    };
  }, [update]);

  return {
    isUploading: UploadObservable.isLoading,
    isError: UploadObservable.isError,
    isPostponed: UploadObservable.isPostponed,
    isCompleted: UploadObservable.isCompleted,
  };
};

export default useUploadObservable;
