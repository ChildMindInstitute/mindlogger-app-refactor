import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { colors } from '@app/shared/lib';
import { RootStackParamList } from '@shared/lib/navigation';
import { Text, CloseIcon } from '@shared/ui';

import packageJson from '../../package.json';
import AboutScreen from './About';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import LoginScreen from './LoginScreen';
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

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={LoginScreen}
      />

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
        name="AboutApp"
        options={{
          title: t('about_app:title_with_version', {
            version: packageJson.version,
          }),
          headerTitleStyle: {
            fontSize: 16,
            color: colors.white,
          },
        }}
        component={AboutScreen}
      />
    </Stack.Navigator>
  );
};
