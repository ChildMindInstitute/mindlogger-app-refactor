import { FC, PropsWithChildren } from 'react';

import { useTranslation } from 'react-i18next';

import { Text, TextProps } from '@shared/ui';

type Props = {
  text: string;
} & TextProps;

const NoListItemsYet: FC<PropsWithChildren<Props>> = ({ text, ...props }) => {
  const { t } = useTranslation();

  return (
    <Text color="$tertiary" fontSize={14} {...props}>
      {t(text)}
    </Text>
  );
};

export default NoListItemsYet;
