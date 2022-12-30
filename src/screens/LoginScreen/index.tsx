import { FC } from 'react';
import { Linking, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
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
  // Icon,
} from '@shared/ui';
import { whiteLogo } from '@images';
// import FontAwesome from '@expo/vector-icons/FontAwesome';

const LoginScreen: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const title = 'MindLogger';

  const navigateToSignUp = () => {
    navigate('SignUpScreen');
  };

  const navigateToForgorPassword = () => {
    navigate('ForgotPasswordScreen');
  };

  const navigateToAbout = () => {
    navigate('About');
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
            <LoginForm onSubmit={() => {}} />
            <HStack>
              <Pressable mr={3} onPress={navigateToSignUp}>
                <Center>{t('login:new_user')}</Center>
              </Pressable>
              <Pressable onPress={navigateToForgorPassword}>
                <Center>{t('login:forgot_password')}</Center>
              </Pressable>
            </HStack>
            <VStack>
              <Pressable mt={2} onPress={navigateToAbout}>
                <Center>{`${t('login:what_is')} ${title}?`}</Center>
              </Pressable>
              <Pressable mt={2} onPress={navigateToAppLanguage}>
                <Center>{t('language_screen:change_app_language')}</Center>
              </Pressable>
              <Pressable mt={2} onPress={() => Linking.openURL('https://mindlogger.org/terms')}>
                <Center>{t('Terms of Service')}</Center>
              </Pressable>
            </VStack>
            <Image mt={5} alt="CMI logo" size="sm" source={whiteLogo} />
          </Center>
          {/*<Pressable onPress={() => {}}>/!*<Icon as={FontAwesome} name="database" />*!/</Pressable>*/}
        </VStack>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
