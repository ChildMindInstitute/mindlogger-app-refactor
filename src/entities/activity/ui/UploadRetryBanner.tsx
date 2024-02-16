import { FC } from 'react';
import { AccessibilityProps } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Box, Button, Text } from '@app/shared/ui';
import { AnalyticsService, MixEvents } from '@shared/lib';

import useQueueProcessing from '../lib/hooks/useQueueProcessing';

type Props = AccessibilityProps;

const UploadRetryBanner: FC<Props> = () => {
  const { isLoading, hasItemsInQueue, process } = useQueueProcessing();

  const { t } = useTranslation();

  const onRetry = () => {
    AnalyticsService.track(MixEvents.RetryButtonPressed);
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
            accessibilityLabel="upload-banner-btn"
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
