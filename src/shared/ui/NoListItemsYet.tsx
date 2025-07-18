import { FC, PropsWithChildren } from 'react';

import { useTranslation } from 'react-i18next';

import { TextProps } from './base';
import { Text } from './Text';

type Props = {
  translationKey: string;
} & TextProps;

export const NoListItemsYet: FC<PropsWithChildren<Props>> = ({
  translationKey,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Text textAlign="center" aria-label="no_items-text" {...props}>
      {t(translationKey)}
    </Text>
  );
};
