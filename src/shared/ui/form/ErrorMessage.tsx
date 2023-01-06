import { FC, PropsWithChildren } from 'react';

import type { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text } from '@shared/ui';

type Props = {
  error?: FieldError;
};

const CheckBoxField: FC<PropsWithChildren<Props>> = ({ error }) => {
  const { t } = useTranslation();

  return (
    <>{error?.message && <Text color="error.500">{t(error.message)}</Text>}</>
  );
};

export default CheckBoxField;
