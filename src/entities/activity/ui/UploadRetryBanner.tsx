import { useCallback, useEffect } from 'react';

import { useIsMutating, useQueryClient } from '@tanstack/react-query';

import { useForceUpdate } from '@app/shared/lib';
import { Box, Button, Text } from '@app/shared/ui';

import { QueueProcessingService } from '../lib';
import useQueueProcessing from '../lib/hooks/useQueueProcessing';

const UploadRetryBanner = () => {
  const reRender = useForceUpdate();

  const onQueueChange = useCallback(() => {
    reRender();
  }, [reRender]);

  useEffect(() => {
    QueueProcessingService.addListener(onQueueChange);
    return () => QueueProcessingService.removeListener(onQueueChange);
  }, [onQueueChange]);

  const { process: processQueue, isLoading: isQueueProcessing } =
    useQueueProcessing();

  const totalLoadingMutations = useIsMutating({
    mutationKey: ['send_answers'],
  });

  const client = useQueryClient();

  const cache = client.getMutationCache();

  const totalActiveMutations = cache
    .getAll()
    .filter(x => x.options.mutationKey?.includes('send_answers'))
    .filter(
      x => x.state.status !== 'success' && x.state.status !== 'error',
    ).length;

  const queueLength = QueueProcessingService.getQueueLength();

  console.log(
    'queueLength, totalMutations, totalLoadingMutations',
    queueLength,
    totalActiveMutations,
    totalLoadingMutations,
    //cache.getAll(),
  );

  const onRetry = () => {
    cache.resumePausedMutations();
    processQueue();
  };

  if (!queueLength && !totalActiveMutations) {
    return <></>;
  }

  return (
    <Box h={50} px={18} bw={1} boc="$grey" bc="$alertLight">
      <Box jc="space-between" ai="center" flexDirection="row" flex={1}>
        <Text flex={1} fos={15}>
          Data not sent (keep app open while we try)
        </Text>

        <Box pl={10}>
          <Button
            bg="transparent"
            spinnerColor="black"
            isLoading={isQueueProcessing || totalLoadingMutations > 0}
            onPress={onRetry}
          >
            <Text fos={16} fontWeight="700">
              Retry
            </Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadRetryBanner;
