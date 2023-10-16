import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { SubmitButton, Box, BoxProps } from '@shared/ui';

type Props = BoxProps & {
  onSendLogs: () => void;
  isLoading: boolean;
};

const ApplicationLogsForm: FC<Props> = props => {
  const { onSendLogs, isLoading, ...boxProps } = props;
  const { t } = useTranslation();

  return (
    <Box {...boxProps}>
      <SubmitButton mode="dark" onPress={onSendLogs} isLoading={isLoading}>
        {t('application_logs_screen:upload_button')}
      </SubmitButton>
    </Box>
  );
};

export default ApplicationLogsForm;
