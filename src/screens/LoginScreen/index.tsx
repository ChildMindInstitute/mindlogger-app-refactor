import { FC } from 'react';
import {
  Linking,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { LoginForm } from '@features/login';
import { Center, Text, Image, YStack, XStack, Box } from '@shared/ui';

import { whiteLogo } from '@images';

const LoginScreen: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const title = 'MindLogger';

  const navigateToSignUp = () => {
    navigate('SignUp');
  };

  const navigateToForgotPassword = () => {
    navigate('ForgotPassword');
  };

  const navigateToAbout = () => {
    navigate('AboutApp');
  };

  const navigateToAppLanguage = () => {
    navigate('AppLanguage');
  };

  const navigateToTerms = () => {
    Linking.openURL('https://mindlogger.org/terms');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} bg="#0067A0">
        <StatusBar />

        <Box flex={1} jc="center">
          <YStack space={30}>
            <Text
              color="white"
              fontWeight="400"
              fontSize={40}
              alignSelf="center">
              {title}
            </Text>

            <LoginForm px="$8" />

            <Center space>
              <XStack space>
                <Text color="white" onPress={navigateToSignUp}>
                  {t('login:new_user')}
                </Text>

                <Text color="white" onPress={navigateToForgotPassword}>
                  {t('login:forgot_password')}
                </Text>
              </XStack>

              <Text color="white" onPress={navigateToAbout}>{`${t(
                'login:what_is',
              )} ${title}?`}</Text>

              <Text color="white" onPress={navigateToAppLanguage}>
                {t('language_screen:change_app_language')}
              </Text>

              <Text color="white" onPress={navigateToTerms}>
                {t('Terms of Service')}
              </Text>
            </Center>

            <Image alignSelf="center" src={whiteLogo} width={70} height={70} />
          </YStack>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
