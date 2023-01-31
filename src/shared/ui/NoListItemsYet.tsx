import { FC, PropsWithChildren } from 'react';

import { useTranslation } from 'react-i18next';

import { Text, TextProps } from '@shared/ui';

type Props = {
  key: string;
} & TextProps;

const NoListItemsYet: FC<PropsWithChildren<Props>> = ({ key, ...props }) => {
  const { t } = useTranslation();

  return (
    <Text color="$tertiary" fontSize={14} {...props}>
      {t(key)}
    </Text>
  );
};

export default NoListItemsYet;
