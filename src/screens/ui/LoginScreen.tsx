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
import {
  Link,
  Image,
  YStack,
  XStack,
  Box,
  SubmitButton,
  Center,
} from '@shared/ui';

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

        <Box flex={1} py="$8">
          <YStack space={30} f={1}>
            <YStack f={2} jc="space-between" h="100%">
              <Center f={1} pt="$5">
                <Image
                  alignSelf="center"
                  src={cloudLogo}
                  width={310}
                  height={55}
                />
              </Center>

              <LoginForm px="$8" pt="$3" onLoginSuccess={onLoginSuccess} />
            </YStack>

            <YStack flex={1} px="$8" jc="space-between">
              <SubmitButton
                borderRadius={30}
                width="100%"
                backgroundColor="$primary"
                borderColor="$white"
                borderWidth={1}
                buttonStyle={{ paddingVertical: 14 }}
                textProps={{
                  fontSize: 14,
                  color: '$white',
                }}
                onPress={navigateToSignUp}
              >
                {t('login:account_create')}
              </SubmitButton>

              <XStack jc="space-between">
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
          </YStack>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
