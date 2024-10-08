import { FC, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  selectEmail,
  selectFirstName,
} from '@app/entities/identity/model/selectors';
import { LogoutRowButton } from '@app/features/logout/ui/LogoutRowButton';
import { colors } from '@app/shared/lib/constants/colors';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { getDefaultSystemRecord } from '@app/shared/lib/records/systemRecordInstance';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { getStringHashCode } from '@app/shared/lib/utils/common';
import { ActivityIndicator } from '@app/shared/ui/ActivityIndicator';
import { Box, YStack } from '@app/shared/ui/base';
import { Center } from '@app/shared/ui/Center';
import { UserIcon } from '@app/shared/ui/icons';
import { RowButton } from '@app/shared/ui/RowButton';
import { Text } from '@app/shared/ui/Text';
import { UploadRetryBanner } from '@app/widgets/survey/ui/UploadRetryBanner';

export const SettingsScreen: FC = () => {
  const { navigate, setOptions } = useNavigation();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const { top } = useSafeAreaInsets();

  const userName = useAppSelector(selectFirstName);
  const userEmail = useAppSelector(selectEmail);

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
    const deviceId = getDefaultSystemRecord().getDeviceId()!;

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
