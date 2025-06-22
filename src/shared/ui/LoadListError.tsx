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
} & TextProps;

export const LoadListError: FC<PropsWithChildren<Props>> = ({
  error,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <>
      {!!error && (
        <Text {...props}>
          {/* @ts-ignore */}
          {error.key ? t(error.key, error.params ?? {}) : t(error)}
        </Text>
      )}
    </>
  );
};
