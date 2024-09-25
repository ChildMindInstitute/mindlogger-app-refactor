import { FC, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  AnalyticsService,
  MixEvents,
} from '@app/shared/lib/analytics/AnalyticsService';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ActivityIndicator } from '@app/shared/ui/ActivityIndicator';
import { Box } from '@app/shared/ui/base';
import { Center } from '@app/shared/ui/Center';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

export const SendApplicationLogsForm: FC = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<boolean>();

  const onSendLogs = async () => {
    setIsLoading(true);

    AnalyticsService.track(MixEvents.UploadLogsPressed);

    const result = await getDefaultLogger().send();

    if (result) {
      AnalyticsService.track(MixEvents.UploadedLogsSuccessfully);
    } else {
      AnalyticsService.track(MixEvents.UploadLogsError);
    }

    setUploadStatus(result);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <Box position="absolute" bg="$grey2" w="100%" h="100%">
          <Center flex={1}>
            <ActivityIndicator size="large" color="$secondary" />
          </Center>
        </Box>
      )}

      <Box flex={1} p="$5" justifyContent="space-between">
        <Box>
          <Text fontSize={18}>{t('application_logs_screen:title')}</Text>

          <Text fontSize={18} mt="$3">
            {t('application_logs_screen:subTitle')}
          </Text>
        </Box>

        <Box>
          <Box>
            <SubmitButton
              mode="dark"
              onPress={onSendLogs}
              isLoading={isLoading}
            >
              {t('application_logs_screen:upload_button')}
            </SubmitButton>
          </Box>
        </Box>
      </Box>

      {uploadStatus && (
        <Box position="absolute" bg="$lightGreen" w="100%" p="$3" px="$4">
          <Text fontWeight="500" fontSize={16}>
            {t('application_logs_screen:success')}
          </Text>
        </Box>
      )}

      {uploadStatus === false && (
        <Box position="absolute" bg="$lightRed" w="100%" p="$3" px="$4">
          <Text fontWeight="500" fontSize={16} color="$errorRed">
            {t('application_logs_screen:error')}
          </Text>
        </Box>
      )}
    </>
  );
};
