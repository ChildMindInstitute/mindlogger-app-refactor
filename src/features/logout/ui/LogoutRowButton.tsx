import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { KeyIcon } from '@app/shared/ui/icons';
import { RowButton } from '@app/shared/ui/RowButton';

import { useLogout } from '../model/hooks';

export const LogoutRowButton: FC = () => {
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
