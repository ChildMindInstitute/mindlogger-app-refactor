import { FC } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { IdentityModel } from '@app/entities/identity';
import { useAppDispatch } from '@app/shared/lib';
import { SessionModel } from '@entities/session';
import { RowButton, KeyIcon } from '@shared/ui';

const LogoutRowButton: FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(IdentityModel.actions.logout());
    SessionModel.clearSession();
    navigate('Login');
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
