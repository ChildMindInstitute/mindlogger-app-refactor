import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { languageModel } from '@entities/language';
import { colors } from '@shared/lib';
import { YStack, XStack, BoxProps, Text, ArrowRightIcon } from '@shared/ui';

type Props = {
  onLanguageChanged: () => void;
} & BoxProps;

const ChangeLanguageSelector: FC<Props> = props => {
  const { onLanguageChanged } = props;
  const { t, i18n } = useTranslation();
  const languagesAvailable = Object.keys(i18n.services.resourceStore.data);
  const { resolvedLanguage } = i18n;

  const onLanguagePress = async (locale: string) => {
    await languageModel.actions.changeLanguage(locale);
    onLanguageChanged();
  };

  return (
    <YStack {...props}>
      {languagesAvailable.map(locale => {
        return (
          <XStack
            onPress={() => onLanguagePress(locale)}
            key={`${locale}`}
            bg={resolvedLanguage === locale ? '$aqua' : 'transparent'}
            h={40}
            px="$2"
            bbc="$lightGrey"
            jc={'space-between'}
            ai={'center'}
            bbw={1}>
            <Text>{t(`language_screen:${locale}`)}</Text>
            <ArrowRightIcon color={colors.mediumGrey} size={15} />
          </XStack>
        );
      })}
    </YStack>
  );
};

export default ChangeLanguageSelector;
