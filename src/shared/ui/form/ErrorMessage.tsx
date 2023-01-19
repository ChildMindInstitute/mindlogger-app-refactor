import { FC, PropsWithChildren } from 'react';

import type { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text, TextProps } from '@shared/ui';

type Props = {
  error?: FieldError | { message: string };
  variant?: 'light' | 'dark' | undefined;
} & TextProps;

const ErrorMessage: FC<PropsWithChildren<Props>> = ({
  error,
  variant,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <>
      {error?.message && (
        <Text
          color={variant === 'light' ? '$secondary' : '$tertiary'}
          fontSize={12}
          {...props}>
          {/* @ts-ignore */}
          {t(error.message, error.params)}
        </Text>
      )}
    </>
  );
};

export default ErrorMessage;
