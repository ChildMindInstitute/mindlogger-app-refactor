import { FC, useState } from 'react';
import { StatusBar } from 'react-native';

import { useTranslation } from 'react-i18next';

import { ApplicationLogsForm } from '@features/application-logs';
import { Logger } from '@shared/lib';
import { Box, Text, Center, ActivityIndicator } from '@shared/ui';

const ApplicationLogsScreen: FC = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<boolean>();

  const onSendLogs = async () => {
    setIsLoading(true);
    const result = await Logger.send();
    setUploadStatus(result);
    setIsLoading(false);
  };

  return (
    <Box flex={1} bg="$white">
      <StatusBar />

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
          <ApplicationLogsForm isLoading={isLoading} onSendLogs={onSendLogs} />
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
    </Box>
  );
};

export default ApplicationLogsScreen;
