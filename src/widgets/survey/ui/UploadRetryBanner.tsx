import { FC } from 'react';
import { AccessibilityProps } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Box, Button, Text } from '@app/shared/ui';
import {
  AnalyticsService,
  Emitter,
  MixEvents,
  useUploadObservable,
} from '@shared/lib';

import { SurveyModel } from '../';
import { useAutoCompletion } from '../model';

type Props = AccessibilityProps;

const UploadRetryBanner: FC<Props> = () => {
  const { hasItemsInQueue } = useAutoCompletion();
  const { isUploading } = useUploadObservable();

  const { t } = useTranslation();

  const onRetry = () => {
    AnalyticsService.track(MixEvents.RetryButtonPressed);

    Emitter.emit<SurveyModel.AutocompletionExecuteOptions>('autocomplete', {
      checksToExclude: [],
      forceUpload: true,
    });
  };

  if (!hasItemsInQueue) {
    return <></>;
  }

  return (
    <Box h={50} px={18} bw={1} boc="$grey" bc="$alertLight">
      <Box jc="space-between" ai="center" flexDirection="row" flex={1}>
        <Text flex={1} fos={14}>
          {t('additional:data_not_sent')}
        </Text>

        <Box pl={10}>
          <Button
            bg="transparent"
            accessibilityLabel="upload-banner-btn"
            spinnerColor="black"
            isLoading={isUploading}
            onPress={onRetry}
          >
            <Text fos={16} fontWeight="700">
              {t('additional:send')}
            </Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadRetryBanner;
