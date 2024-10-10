import { FC, PropsWithChildren } from 'react';

import type { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TextProps } from '../base';
import { Text } from '../Text';

type Props = {
  error?: Partial<FieldError>;
  mode?: 'dark' | 'light';
} & TextProps;

export const ErrorMessage: FC<PropsWithChildren<Props>> = ({
  error,
  mode,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <>
      {!!error?.message && (
        <Text
          color={mode === 'light' ? '$secondary' : '$tertiary'}
          fontSize={12}
          {...props}
        >
          {/* @ts-ignore */}
          {t(error.message, error.params)}
        </Text>
      )}
    </>
  );
};
