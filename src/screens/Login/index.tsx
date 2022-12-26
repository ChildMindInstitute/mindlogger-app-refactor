import { FC } from 'react';
import { Linking, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { whiteLogo } from '../../../assets/img';
import { LoginForm } from '../../features/login';
import {
  StatusBar,
  KeyboardAvoidingView,
  Center,
  Text,
  Image,
  VStack,
  HStack,
  Pressable,
} from '../../shared/ui';
import { useTranslation } from 'react-i18next';

type Props = {
  signInSuccessful: () => {};
  toggleMobileDataAllowed: () => void;
  skin: {
    colors: {
      primary: string;
    };
    name: string;
    logo?: string;
  };
  mobileDataAllowed: boolean;
  fcmToken: string | null;
  appLanguage: 'fr' | 'en';
};

const LoginScreen: FC = () => {
  const mockProps: Props = {
    appLanguage: 'en',
    skin: {
      colors: {
        primary: 'red',
      },
      name: 'MindLogger',
    },
  };
  const { skin } = mockProps;

  const { navigate } = useNavigation();
  const { t, i18n } = useTranslation();
  const title = skin.name;

  const changeLanguageHandler = () => {
    i18n.changeLanguage('en');
  };

  const navigateToSignUp = () => {
    navigate('SignUp');
  };
  //
  // const navigateToChangeStudy = () => {
  //   navigate('ChangeStudy');
  // };

  const navigateToForgorPassword = () => {
    navigate('ForgotPassword');
  };

  const navigateToAbout = () => {
    navigate('About');
  };

  const navigateToAppLanguage = () => {
    changeLanguageHandler();

    navigate('AppLanguage');
  };

  return (
    <KeyboardAvoidingView>
      <SafeAreaView>
        <StatusBar />
        <VStack h="100%" bg="primary.50">
          <Center
            my="auto"
            // style={[{ backgroundColor: skin.colors.primary }]}
            // contentContainerStyle={styles.contentContainer}
          >
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
          {/*<Footer style={styles.footer}>*/}
          {/*  <Right>*/}
          {/*    <Pressable onPress={navigateToChangeStudy}>*/}
          {/*      <Icon type="FontAwesome" name="database" style={styles.whiteIcon} />*/}
          {/*    </Pressable>*/}
          {/*  </Right>*/}
          {/*</Footer>*/}
        </VStack>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
