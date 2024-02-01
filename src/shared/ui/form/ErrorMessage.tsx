import { FC, PropsWithChildren } from 'react';

import type { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text, TextProps } from '@shared/ui';

type Props = {
  error?: Partial<FieldError>;
  mode?: 'dark' | 'light';
} & TextProps;

const ErrorMessage: FC<PropsWithChildren<Props>> = ({
  error,
  mode,
  ...props
}) => {
  const { t } = useTranslation();
  const renderError = (err: string, params?: any) => {
    return (
      <Text
        color={mode === 'light' ? '$secondary' : '$tertiary'}
        fontSize={12}
        {...props}
      >
        {t(err, params)}
      </Text>
    );
  };

  return <>{error?.message && renderError(error?.message)}</>;
};

export default ErrorMessage;
