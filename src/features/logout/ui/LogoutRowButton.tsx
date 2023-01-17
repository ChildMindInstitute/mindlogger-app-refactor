import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { RowButton, KeyIcon } from '@shared/ui';

const LogoutRowButton: FC = () => {
  const { t } = useTranslation();
  const logout = () => {
    console.log('logout');
  };

  return (
    <RowButton
      onPress={logout}
      title={t('settings:logout')}
      rightIcon={KeyIcon}
    />
  );
};

export default LogoutRowButton;
