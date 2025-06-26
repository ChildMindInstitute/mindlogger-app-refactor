import { FC } from 'react';

import { SendApplicationLogsForm } from '@app/features/send-application-logs/ui/SendApplicationLogsForm';
import { Box } from '@app/shared/ui/base';

export const ApplicationLogsScreen: FC = () => {
  return (
    <Box flex={1}>
      <SendApplicationLogsForm />
    </Box>
  );
};
