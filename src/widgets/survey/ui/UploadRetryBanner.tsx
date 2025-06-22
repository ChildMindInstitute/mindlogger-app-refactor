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

export const UploadRetryBanner: FC<Props> = ({ ...props }) => {
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
    <Box
      px={16}
      py={8}
      boc="$on_error_container"
      bc="$error_container"
      {...props}
    >
      <Box jc="space-between" ai="center" flexDirection="row">
        <Text flex={1} fontSize={14} color="$on_error_container">
          {isUploading
            ? t('additional:data_is_sending')
            : t('additional:data_not_sent')}
        </Text>

        <Box pl={10}>
          <Button
            py={6}
            bg="$on_surface_alpha12"
            boc="$on_error_container"
            bw={1}
            textProps={{
              fontSize: 14,
              fontWeight: '700',
            }}
            aria-label="upload-banner-btn"
            isLoading={isUploading}
            onPress={onRetry}
          >
            {t('additional:send')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
