import { FC, useMemo } from 'react';
import { StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { UploadRetryBanner } from '@app/entities/activity';
import { IdentityModel } from '@app/entities/identity';
import { LogoutRowButton } from '@features/logout';
import { SystemRecord, colors, getStringHashCode, useAppSelector } from '@shared/lib';
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

  const navigateToAppLogs = () => {
    navigate('ApplicationLogs');
  };

  const hashedDeviceId: string = useMemo(() => {
    const deviceId = SystemRecord.getDeviceId()!;

    const hashed: string = !deviceId ? 'undefined' : getStringHashCode(deviceId).toString();
    return hashed;
  }, []);

  return (
    <Box flex={1} bg="$secondary">
      <StatusBar />
      <UploadRetryBanner />

      <Box flex={1} px="$2" jc="flex-start">
        <YStack>
          <YStack space="$2" my="$4" ai="center">
            <UserIcon color={colors.darkGrey} size={45} />
            <Text accessibilityLabel="account_name">{userName}</Text>
            <Text accessibilityLabel="account_email">{userEmail}</Text>

            <Text accessibilityLabel="account_device_id">{`${t('about:device_id')}: ${hashedDeviceId}`}</Text>
          </YStack>

          <RowButton
            onPress={navigateToChangePasswordScreen}
            accessibilityLabel="change_password-button"
            title={t('settings:change_pass')}
          />

          <RowButton
            onPress={navigateToAppLanguage}
            accessibilityLabel="change_language-button"
            title={t('language_screen:change_app_language')}
          />

          <RowButton
            onPress={navigateToAppLogs}
            accessibilityLabel="upload_logs-button"
            title={t('settings:upload_logs')}
          />

          <LogoutRowButton />
        </YStack>
      </Box>
    </Box>
  );
};

export default SettingsScreen;
