import { FC } from 'react';
import { StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { UploadRetryBanner } from '@app/entities/activity';
import { IdentityModel } from '@app/entities/identity';
import { LogoutRowButton } from '@features/logout';
import { colors, useAppSelector } from '@shared/lib';
import { YStack, Box, RowButton, UserIcon, Text } from '@shared/ui';

const SettingsScreen: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const userName = useAppSelector(IdentityModel.selectors.selectFirstName);
  const userEmail = useAppSelector(IdentityModel.selectors.selectEmail);

  const navigateToAppLanguage = () => {
    navigate('ChangeLanguage');
  };

  const navigateToChangePasswordScreen = () => {
    navigate('ChangePassword');
  };

  return (
    <Box flex={1} bg="$secondary">
      <StatusBar />
      <UploadRetryBanner />

      <Box flex={1} px="$2" jc="flex-start">
        <YStack>
          <YStack space="$2" my="$4" ai="center">
            <UserIcon color={colors.darkGrey} size={45} />
            <Text>{userName}</Text>
            <Text>{userEmail}</Text>
          </YStack>

          <RowButton
            onPress={navigateToChangePasswordScreen}
            title={t('settings:change_pass')}
          />

          <RowButton
            onPress={navigateToAppLanguage}
            title={t('language_screen:change_app_language')}
          />

          <LogoutRowButton />
        </YStack>
      </Box>
    </Box>
  );
};

export default SettingsScreen;
