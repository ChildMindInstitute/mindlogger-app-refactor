import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '@shared/lib/navigation';

import ForgotPasswordScreen from './ForgotPasswordScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = () => {
  return {
    headerStyle: {
      backgroundColor: '#0067A0', // @todo find a way to take this value from native-base (primary.50)
    },
    headerTitleStyle: {
      color: '#fff',
    },
    headerShadowVisible: false,
  };
};

export default () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        options={{
          title: '',
        }}
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="ForgotPassword"
        options={{
          title: t('login:forgot_password') as string,
        }}
        component={ForgotPasswordScreen}
      />

      <Stack.Screen
        name="SignUp"
        options={{
          title: t('login:new_user') as string,
        }}
        component={SignUpScreen}
      />
    </Stack.Navigator>
  );
};
