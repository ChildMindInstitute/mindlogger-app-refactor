import { FC } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isTablet } from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoginForm } from '@app/features/login/ui/LoginForm';
import { openUrl } from '@app/screens/lib/utils/helpers';
import { IS_SMALL_HEIGHT_SCREEN } from '@app/shared/lib/constants';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { Link } from '@app/shared/ui/Link';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { curiousLogoBlack } from '@assets/images';

export const LoginScreen: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const navigateToSignUp = () => {
    navigate('SignUp');
  };

  const navigateToAppLanguage = () => {
    navigate('ChangeLanguage');
  };

  const onLoginSuccess = () => {
    navigate('Applets');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} px={isTablet() ? '$20' : 0}>
        <Box f={1} px="$8" gap={48}>
          <Box f={1} jc="center">
            <YStack
              mb={bottom + (IS_SMALL_HEIGHT_SCREEN ? 12 : 52)}
              jc="flex-end"
              alignItems="center"
            >
              <Image
                source={curiousLogoBlack}
                width={251}
                height={54}
                style={{
                  width: 251,
                  height: 54,
                }}
              />
            </YStack>

            <LoginForm onLoginSuccess={onLoginSuccess} />

            <SubmitButton
              accessibilityLabel="create_an_account-button"
              mt={24}
              width="100%"
              mode="secondary"
              onPress={navigateToSignUp}
            >
              {t('login:account_create')}
            </SubmitButton>
          </Box>

          <XStack
            jc="space-around"
            mb={IS_SMALL_HEIGHT_SCREEN ? 32 : 72}
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

            <Link
              textDecorationLine="underline"
              onPress={() => openUrl('https://mindlogger.org/privacy-policy')}
              accessibilityLabel="privacy_policy_link"
            >
              {t('auth:privacy')}
            </Link>
          </XStack>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};
