import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '@shared/lib/navigation';
import { Text, CloseIcon } from '@shared/ui';

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
      backgroundColor: '#0067A0', // @todo find a way to take this value from tamagui
    },
    headerTitleStyle: {
      color: '#fff',
    },
    headerShadowVisible: false,
    headerLeft: () => (
      <Text onPress={navigation.goBack}>
        <CloseIcon color="#fff" size={22} />
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
        }}
        component={SignUpScreen}
      />
    </Stack.Navigator>
  );
};
