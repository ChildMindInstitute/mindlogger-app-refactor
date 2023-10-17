import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { onDeleteAccount } from '@app/shared/lib';
import { RowButton } from '@shared/ui';

import { useDeleteAccount } from './model';

const DeleteAccountRowButton: FC = () => {
  const { t } = useTranslation();
  const { requestDeleteAccount } = useDeleteAccount();

  const onPress = () => {
    onDeleteAccount(requestDeleteAccount);
  };

  return <RowButton onPress={onPress} title={t('settings:delete_account')} />;
};

export default DeleteAccountRowButton;
