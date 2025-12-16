import { FC } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isTablet } from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MfaVerificationForm } from '@app/features/mfa-verification/ui/MfaVerificationForm';
import { openUrl } from '@app/screens/lib/utils/helpers';
import { Box, XStack } from '@app/shared/ui/base';
import { Link } from '@app/shared/ui/Link';

export const MfaVerificationScreen: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const navigateToAppLanguage = () => {
    navigate('ChangeLanguage');
  };

  const handleVerificationSuccess = () => {
    // TODO: Navigate to the appropriate screen after successful verification
    // This will be wired up in the next step
    console.log('Verification successful, navigating...');
    navigate('Applets');
  };

  const handleUseRecoveryCode = () => {
    // Navigate to the recovery code screen
    navigate('MfaRecovery');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} px={isTablet() ? '$20' : 0}>
        <Box flex={1} px="$8" jc="space-between" py={48}>
          <Box flex={1} jc="center">
            <MfaVerificationForm
              onVerificationSuccess={handleVerificationSuccess}
              onUseRecoveryCode={handleUseRecoveryCode}
            />
          </Box>

          <XStack
            jc="space-around"
            mb={bottom + 72}
            flexWrap="wrap"
            ai="center"
          >
            <Link
              textDecorationLine="underline"
              accessibilityLabel="change_language-link"
              onPress={navigateToAppLanguage}
            >
              {t('language_screen:change_app_language')}
            </Link>

            <Link
              textDecorationLine="underline"
              onPress={() => openUrl('https://mindlogger.org/terms-of-service')}
              accessibilityLabel="terms_of_service_link"
            >
              {t('auth:terms')}
            </Link>
          </XStack>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};
