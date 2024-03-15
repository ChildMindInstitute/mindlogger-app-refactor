import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { RowButton, KeyIcon } from '@shared/ui';

import { useLogout } from '../model';

type Props = {
  onPress: () => void;
};

const LogoutRowButton: FC<Props> = ({ onPress }) => {
  const { t } = useTranslation();
  const { logout } = useLogout();

  function performLogout() {
    logout();
    onPress();
  }

  return (
    <RowButton
      onPress={performLogout}
      accessibilityLabel="logout-button"
      title={t('settings:logout')}
      rightIcon={KeyIcon}
    />
  );
};

export default LogoutRowButton;
