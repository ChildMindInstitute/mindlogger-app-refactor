import { FC } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isTablet } from 'react-native-device-info';

import { LoginForm } from '@app/features/login/ui/LoginForm';
import { openUrl } from '@app/screens/lib/utils/helpers';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { Link } from '@app/shared/ui/Link';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { curiousLogoBlack } from '@assets/images';

export const LoginScreen: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

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
      <Box flex={1} px={isTablet() ? '$12' : 0}>
        <Box f={1} px={isTablet() ? '$17' : '$8'}>
          <Box f={1} jc="center">
            <YStack mb={50} jc="flex-end" alignItems="center">
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
              borderRadius={30}
              accessibilityLabel="create_an_account-button"
              mt={22}
              width="100%"
              backgroundColor="$primary"
              borderColor="$lighterGrey4"
              borderWidth={1}
              buttonStyle={{ paddingVertical: 16 }}
              textProps={{
                fontSize: 14,
                color: '$white',
              }}
              onPress={navigateToSignUp}
            >
              {t('login:account_create')}
            </SubmitButton>
          </Box>

          <XStack
            jc={isTablet() ? 'space-around' : 'center'}
            mb={isTablet() ? 50 : 40}
            gap={isTablet() ? 0 : 20}
            width="100%"
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
