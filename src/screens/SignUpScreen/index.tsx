import { FC } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { SignUpForm } from '@features/sign-up';
import { StatusBar, Center, Box, YStack } from '@shared/ui';

const SignUpScreen: FC = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} bg="$primary">
        <StatusBar />

        <YStack h="100%">
          <Center>
            <Box w="75%" mt={30}>
              <SignUpForm />
            </Box>
          </Center>
        </YStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;
