import { Trans } from 'react-i18next';

import { Text } from '@app/shared/ui/Text';

type Props = {
  email: string;
};

export const SuccessNotification = (props: Props) => {
  return (
    <Text fontSize={16} lineHeight={24}>
      <Trans
        i18nKey="forgot_pass_form:email_send_success"
        components={{
          strong: <Text fontSize={16} fontWeight="800" />,
        }}
        values={{ email: props.email }}
      />
    </Text>
  );
};
