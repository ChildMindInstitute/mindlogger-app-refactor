import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { RowButton, KeyIcon } from '@shared/ui';

import { useLogout } from '../model';

const LogoutRowButton: FC = () => {
  const { t } = useTranslation();
  const { logout } = useLogout();

  function performLogout() {
    logout();
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
