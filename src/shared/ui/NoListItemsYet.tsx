import { FC, PropsWithChildren } from 'react';

import { useTranslation } from 'react-i18next';

import { Text, TextProps } from '@shared/ui';

type Props = {
  translationKey: string;
} & TextProps;

const NoListItemsYet: FC<PropsWithChildren<Props>> = ({
  translationKey,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Text
      color="$tertiary"
      fontSize={14}
      textAlign="center"
      accessibilityLabel="no_items-text"
      {...props}
    >
      {t(translationKey)}
    </Text>
  );
};

export default NoListItemsYet;
