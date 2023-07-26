import { useTranslation } from 'react-i18next';

import { Box, Button, Text } from '@app/shared/ui';

import useQueueProcessing from '../lib/hooks/useQueueProcessing';

const UploadRetryBanner = () => {
  const { isLoading, hasItemsInQueue, process } = useQueueProcessing();

  const { t } = useTranslation();

  const onRetry = () => {
    process();
  };

  if (!hasItemsInQueue) {
    return <></>;
  }

  return (
    <Box h={50} px={18} bw={1} boc="$grey" bc="$alertLight">
      <Box jc="space-between" ai="center" flexDirection="row" flex={1}>
        <Text flex={1} fos={15}>
          {t('additional:data_not_sent')}
        </Text>

        <Box pl={10}>
          <Button
            bg="transparent"
            spinnerColor="black"
            isLoading={isLoading}
            onPress={onRetry}
          >
            <Text fos={16} fontWeight="700">
              {t('additional:retry')}
            </Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadRetryBanner;
