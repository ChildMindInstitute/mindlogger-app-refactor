import { FC } from 'react';
import {
  Linking,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isTablet } from 'react-native-device-info';

import { LoginForm } from '@features/login';
import { Link, XStack, Box, SubmitButton, CloudLogo } from '@shared/ui';

const LoginScreen: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const navigateToSignUp = () => {
    navigate('SignUp');
  };

  const navigateToAppLanguage = () => {
    navigate('ChangeLanguage');
  };

  const navigateToTerms = () => {
    Linking.openURL('https://mindlogger.org/terms');
  };

  const onLoginSuccess = () => {
    navigate('Applets');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} bg="$primary" px={isTablet() ? '$12' : 0}>
        <StatusBar />

        <Box f={1} px={isTablet() ? '$17' : '$8'}>
          <Box
            mb={isTablet() ? 30 : 50}
            pt={isTablet() ? 220 : 110}
            jc="flex-end"
          >
            <CloudLogo width="100%" height={70} />
          </Box>

          <Box f={1}>
            <LoginForm onLoginSuccess={onLoginSuccess} />

            <SubmitButton
              borderRadius={30}
              accessibilityLabel="create-account-navigation-button"
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
            jc={isTablet() ? 'space-around' : 'space-between'}
            mb={isTablet() ? 50 : 40}
          >
            <Link
              textDecorationLine="underline"
              onPress={navigateToAppLanguage}
            >
              {t('language_screen:change_app_language')}
            </Link>

            <Link textDecorationLine="underline" onPress={navigateToTerms}>
              {t('auth:terms_of_service')}
            </Link>
          </XStack>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
