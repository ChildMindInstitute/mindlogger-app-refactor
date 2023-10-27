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
import { Link, Image, YStack, XStack, Box, SubmitButton } from '@shared/ui';

import { cloudLogo } from '@images';

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
      <Box flex={1} bg="$primary">
        <StatusBar />

        <Box f={1} px={isTablet() ? '$16' : '$8'}>
          <Box mb={64} pt={isTablet() ? 250 : 140} jc="flex-end">
            <Image alignSelf="center" src={cloudLogo} width={310} height={55} />
          </Box>

          <Box f={1}>
            <LoginForm onLoginSuccess={onLoginSuccess} />

            <SubmitButton
              borderRadius={30}
              mt={24}
              width="100%"
              backgroundColor="$primary"
              borderColor="$white"
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
        </Box>

        <YStack px="$8" mt={24} jc="space-between">
          <XStack jc="space-between" mb={40}>
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
        </YStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
