import { FC, PropsWithChildren } from 'react';

import type { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text, TextProps } from '@shared/ui';

type Props = {
  error?: FieldError;
} & TextProps;

const ErrorMessage: FC<PropsWithChildren<Props>> = ({ error, ...props }) => {
  const { t } = useTranslation();

  return (
    <>
      {error?.message && (
        <Text color="$secondary" fontSize={12} {...props}>
          {/* @ts-ignore */}
          {t(error.message, error.params)}
        </Text>
      )}
    </>
  );
};

export default ErrorMessage;
