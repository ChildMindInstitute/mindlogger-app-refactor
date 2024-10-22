import { FC, PropsWithChildren } from 'react';

import { useTranslation } from 'react-i18next';

import { TextProps } from './base';
import { Text } from './Text';

type LoadError = {
  key: string;
  params?: Record<string, string>;
};

type Props = {
  error?: string | LoadError;
  mode?: 'dark' | 'light';
} & TextProps;

export const LoadListError: FC<PropsWithChildren<Props>> = ({
  error,
  mode,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <>
      {!!error && (
        <Text
          color={mode === 'light' ? '$secondary' : '$tertiary'}
          fontSize={14}
          {...props}
        >
          {/* @ts-ignore */}
          {error.key ? t(error.key, error.params ?? {}) : t(error)}
        </Text>
      )}
    </>
  );
};
