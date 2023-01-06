import { FC } from 'react';
import { Linking, SafeAreaView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { LoginForm } from '@features/login';
import {
  StatusBar,
  KeyboardAvoidingView,
  Center,
  Text,
  Image,
  VStack,
  HStack,
  Pressable,
  Flex,
} from '@shared/ui';

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

  return (
    <KeyboardAvoidingView>
      <SafeAreaView>
        <StatusBar />

        <VStack h="100%" bg="primary.50">
          <Center my="auto">
            <Text fontSize="4xl" mb="2">
              {title}
            </Text>

            <Flex w="75%">
              <LoginForm />
            </Flex>

            <HStack mb={2}>
              <Pressable mr={3} onPress={navigateToSignUp}>
                <Center>{t('login:new_user')}</Center>
              </Pressable>

              <Pressable onPress={navigateToForgotPassword}>
                <Center>{t('login:forgot_password')}</Center>
              </Pressable>
            </HStack>

            <VStack space={2}>
              <Pressable onPress={navigateToAbout}>
                <Center>{`${t('login:what_is')} ${title}?`}</Center>
              </Pressable>

              <Pressable onPress={navigateToAppLanguage}>
                <Center>{t('language_screen:change_app_language')}</Center>
              </Pressable>

              <Pressable
                onPress={() => Linking.openURL('https://mindlogger.org/terms')}>
                <Center>{t('Terms of Service')}</Center>
              </Pressable>
            </VStack>

            <Image mt={5} alt="CMI logo" size="sm" source={whiteLogo} />
          </Center>
        </VStack>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
