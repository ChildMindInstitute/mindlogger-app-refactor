import { FC } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { SignUpForm } from '@features/sign-up';
import { StatusBar, Center, Box, YStack } from '@shared/ui';

const SignUpScreen: FC = () => {
  const { navigate } = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} bg="$primary">
        <StatusBar />

        <YStack h="100%">
          <Center>
            <Box w="75%" mt={30}>
              <SignUpForm onLoginSuccess={() => navigate('Applets')} />
            </Box>
          </Center>
        </YStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;
