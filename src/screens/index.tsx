import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '@shared/lib/navigation';

import ForgotPasswordScreen from './ForgotPasswordScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="ForgotPassword"
        options={{
          title: 'Forgot Password',
        }}
        component={ForgotPasswordScreen}
      />

      <Stack.Screen
        name="SignUp"
        options={{
          title: 'New User',
        }}
        component={SignUpScreen}
      />
    </Stack.Navigator>
  );
};
