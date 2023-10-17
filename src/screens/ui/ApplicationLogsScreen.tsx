import { FC } from 'react';
import { StatusBar } from 'react-native';

import { SendApplicationLogsForm } from '@features/send-application-logs';
import { Box } from '@shared/ui';

const ApplicationLogsScreen: FC = () => {
  return (
    <Box flex={1} bg="$white">
      <StatusBar />
      <SendApplicationLogsForm />
    </Box>
  );
};

export default ApplicationLogsScreen;
