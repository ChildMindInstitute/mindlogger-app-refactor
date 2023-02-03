import { TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { APP_VERSION, colors, ENV } from '@app/shared/lib';
import { RootStackParamList } from '@shared/lib/navigation';
import { Text, CloseIcon, UserProfileIcon } from '@shared/ui';

import AboutScreen from './AboutScreen';
import AppletsScreen from './AppletsScreen';
import ChangeLanguageScreen from './ChangeLanguageScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import LoginScreen from './LoginScreen';
import SettingsScreen from './SettingsScreen';
import SignUpScreen from './SignUpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

type ScreenOptions = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const screenOptions = ({ navigation }: ScreenOptions) => {
  return {
    headerStyle: {
      backgroundColor: colors.primary,
    },
    headerTitleStyle: {
      color: colors.white,
    },
    headerShadowVisible: false,
    headerLeft: () => (
      <Text onPress={navigation.goBack} mr={24}>
        <CloseIcon color={colors.white} size={22} />
      </Text>
    ),
  };
};

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />

      <Stack.Screen
        name="ForgotPassword"
        options={{
          title: t('login:forgot_password'),
        }}
        component={ForgotPasswordScreen}
      />

      <Stack.Screen
        name="SignUp"
        options={{
          title: t('login:new_user'),
          contentStyle: {
            borderTopColor: colors.grey,
            borderTopWidth: 1,
          },
        }}
        component={SignUpScreen}
      />

      <Stack.Screen
        name="ChangeLanguage"
        options={{
          title: t('language_screen:app_language'),
        }}
        component={ChangeLanguageScreen}
      />

      <Stack.Screen
        name="AboutApp"
        options={{
          title: t('about_app:title_with_version', {
            version: ENV ? `${APP_VERSION} ${ENV}` : APP_VERSION,
          }),
          headerTitleStyle: {
            fontSize: 16,
            color: colors.white,
          },
        }}
        component={AboutScreen}
      />

      <Stack.Screen
        name="Applets"
        options={{
          title: 'Applets',
          headerStyle: {
            backgroundColor: colors.lighterGrey2,
          },
          headerTitleStyle: {
            fontSize: 16,
            color: colors.tertiary,
          },
          headerLeft: () => (
            <Text onPress={() => navigation.goBack()} mr={24}>
              <CloseIcon color={colors.tertiary} size={22} />
            </Text>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <UserProfileIcon color={colors.tertiary} size={22} />
            </TouchableOpacity>
          ),
        }}
        component={AppletsScreen}
      />
    </Stack.Navigator>
  );
};
