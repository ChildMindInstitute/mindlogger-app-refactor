import { FC } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { colors } from '@shared/lib';
import {
  YStack,
  XStack,
  Box,
  BoxProps,
  Text,
  ArrowRightIcon,
} from '@shared/ui';

const ChangeLanguageSelector: FC<BoxProps> = props => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const languagesAvailable = Object.keys(i18n.services.resourceStore.data);
  const { resolvedLanguage } = i18n;

  const changeLanguage = async (locale: string) => {
    await i18n.changeLanguage(locale);
    navigation.goBack();
  };

  return (
    <Box {...props}>
      <YStack>
        {languagesAvailable.map(locale => {
          return (
            <XStack
              onPress={() => changeLanguage(locale)}
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
    </Box>
  );
};

export default ChangeLanguageSelector;
