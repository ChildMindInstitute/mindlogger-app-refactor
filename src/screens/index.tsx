import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './Login';

const Stack = createNativeStackNavigator();

export const Routing = () => {
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
