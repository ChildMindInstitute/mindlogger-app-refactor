import { FC, useEffect, useMemo, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  selectEmail,
  selectFirstName,
} from '@app/entities/identity/model/selectors';
import { LogoutRowButton } from '@app/features/logout/ui/LogoutRowButton';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { getDefaultSystemRecord } from '@app/shared/lib/records/systemRecordInstance';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { getStringHashCode } from '@app/shared/lib/utils/common';
import { Box, YStack } from '@app/shared/ui/base';
import { UserIcon } from '@app/shared/ui/icons';
import { RowButton } from '@app/shared/ui/RowButton';
import { Spinner } from '@app/shared/ui/Spinner';
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
      <Box flex={1}>
        <UploadRetryBanner />

        <Box flex={1} px={16} jc="flex-start" mt={isLoading ? top : 0}>
          <YStack>
            <YStack space="$2" my="$8" ai="center">
              <UserIcon color={palette.on_surface} size={45} />
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

      {isLoading && <Spinner withOverlay overlayColor={palette.surface} />}
    </>
  );
};
