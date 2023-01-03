import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '@shared/lib/navigation';

import LoginScreen from './LoginScreen';

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
    </Stack.Navigator>
  );
};
