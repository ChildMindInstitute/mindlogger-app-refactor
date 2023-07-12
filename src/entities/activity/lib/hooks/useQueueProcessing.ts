import { useState } from 'react';

import { QueueProcessingService } from '../services';
import { SendAnswersInput } from '../types';

type Result = {
  process(): Promise<boolean>;
  push(input: SendAnswersInput): void;
  isLoading: boolean;
  isError: boolean;
};

const useQueueProcessing = (): Result => {
  const [isLoading, setIsLoading] = useState(false);

  const [isError, setIsError] = useState(false);

  const process = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const success = await QueueProcessingService.process();

      setIsError(!success);

      return success;
    } catch {
      setIsError(true);

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isError,
    isLoading,
    process,
    push: QueueProcessingService.push.bind(QueueProcessingService),
  };
};

export default useQueueProcessing;
