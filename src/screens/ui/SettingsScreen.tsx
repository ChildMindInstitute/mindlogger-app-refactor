import { FC, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UploadRetryBanner } from '@app/entities/activity';
import { IdentityModel } from '@app/entities/identity';
import { LogoutRowButton } from '@features/logout';
import {
  SystemRecord,
  colors,
  getStringHashCode,
  useAppSelector,
  Emitter,
} from '@shared/lib';
import {
  YStack,
  Box,
  RowButton,
  UserIcon,
  Text,
  Center,
  ActivityIndicator,
} from '@shared/ui';

const SettingsScreen: FC = () => {
  const { navigate, setOptions } = useNavigation();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const { top } = useSafeAreaInsets();

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

    const hashed: string = !deviceId
      ? 'undefined'
      : getStringHashCode(deviceId).toString();
    return hashed;
  }, []);

  useEffect(() => {
    function setLoading() {
      setIsLoading(true);
      setOptions({
        headerShown: false,
      });
    }

    Emitter.on('logout', setLoading);

    return () => {
      Emitter.off('logout', setLoading);
    };
  }, [setOptions]);

  return (
    <>
      <Box flex={1} bg="$secondary">
        <StatusBar />
        <UploadRetryBanner />

        <Box flex={1} px="$2" jc="flex-start" mt={isLoading ? top : 0}>
          <YStack>
            <YStack space="$2" my="$4" ai="center">
              <UserIcon color={colors.darkGrey} size={45} />
              <Text accessibilityLabel="account_name">{userName}</Text>
              <Text accessibilityLabel="account_email">{userEmail}</Text>

              <Text accessibilityLabel="account_device_id">{`${t(
                'about:device_id',
              )}: ${hashedDeviceId}`}</Text>
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

      {isLoading && (
        <Center w="100%" h="100%" position="absolute">
          <Box
            w="100%"
            h="100%"
            bg="$white"
            position="absolute"
            opacity={0.7}
          />

          <ActivityIndicator size="large" color="#0067A0" />
        </Center>
      )}
    </>
  );
};

export default SettingsScreen;
