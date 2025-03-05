import { FC } from 'react';
import { AccessibilityProps } from 'react-native';

import { useTranslation } from 'react-i18next';

import { AutocompletionEventOptions } from '@app/abstract/lib/types/autocompletion';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import { MixEvents } from '@app/shared/lib/analytics/IAnalyticsService';
import { useUploadObservable } from '@app/shared/lib/hooks/useUploadObservable';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { Box } from '@app/shared/ui/base';
import { Button } from '@app/shared/ui/Button';
import { Text } from '@app/shared/ui/Text';

import { useAutoCompletion } from '../model/hooks/useAutoCompletion';

type Props = AccessibilityProps;

export const UploadRetryBanner: FC<Props> = () => {
  const { hasItemsInQueue } = useAutoCompletion();
  const { isUploading } = useUploadObservable();

  const { t } = useTranslation();

  const onRetry = () => {
    getDefaultAnalyticsService().track(MixEvents.RetryButtonPressed);

    Emitter.emit<AutocompletionEventOptions>('autocomplete', {
      checksToExclude: [],
      forceUpload: true,
      logTrigger: 'retry-on-banner',
    });
  };

  if (!hasItemsInQueue) {
    return <></>;
  }

  return (
    <Box h={50} px={18} bw={1} boc="$grey" bc="$alertLight">
      <Box jc="space-between" ai="center" flexDirection="row" flex={1}>
        <Text flex={1} fontSize={14}>
          {isUploading
            ? t('additional:data_is_sending')
            : t('additional:data_not_sent')}
        </Text>

        <Box pl={10}>
          <Button
            bg="transparent"
            accessibilityLabel="upload-banner-btn"
            spinnerColor="black"
            isLoading={isUploading}
            onPress={onRetry}
          >
            <Text fontSize={16} fontWeight="700">
              {t('additional:send')}
            </Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
