import { FC } from 'react';
import {
  Linking,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { StackedRadioActivityItem } from '@app/shared/ui/survey/StackedRadioActivityItem';
import { LoginForm } from '@features/login';
import {
  Center,
  Text,
  Image,
  YStack,
  XStack,
  Box,
  ScrollView,
} from '@shared/ui';

import { whiteLogo } from '@images';

const Link = styled(Text, { color: '$secondary' });

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
      <ScrollView>
        <Box flex={1} bg="$primary">
          <StatusBar />

          <Box flex={1} jc="center">
            <YStack space={30}>
              <Link
                color="$secondary"
                fontWeight="400"
                fontSize={40}
                alignSelf="center"
              >
                {title}
              </Link>

              <LoginForm px="$8" onLoginSuccess={onLoginSuccess} />

              <Center space>
                <XStack space>
                  <Link onPress={navigateToSignUp}>{t('login:new_user')}</Link>

                  <Link onPress={navigateToForgotPassword}>
                    {t('login:forgot_password')}
                  </Link>
                </XStack>

                <Link onPress={navigateToAbout}>{`${t(
                  'login:what_is',
                )} ${title}?`}</Link>

                <Link onPress={navigateToAppLanguage}>
                  {t('language_screen:change_app_language')}
                </Link>

                <Link onPress={navigateToTerms}>{t('Terms of Service')}</Link>
              </Center>

              <Image
                alignSelf="center"
                src={whiteLogo}
                width={70}
                height={70}
              />
            </YStack>
          </Box>
        </Box>

        <Box>
          <StackedRadioActivityItem />
        </Box>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
