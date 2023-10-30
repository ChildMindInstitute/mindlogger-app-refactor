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
import { Link, Image, XStack, Box, SubmitButton } from '@shared/ui';

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
      <Box flex={1} bg="$primary" px={isTablet() ? '$12' : 0}>
        <StatusBar />

        <Box f={1} px={isTablet() ? '$16' : '$8'}>
          <Box
            mb={isTablet() ? 50 : 50}
            pt={isTablet() ? 200 : 140}
            jc="flex-end"
          >
            <Image
              alignSelf="center"
              resizeMode="contain"
              src={cloudLogo}
              // width={isTablet() ? '100%' : 310}
              width={'100%'}
              height={70}
            />
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
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
