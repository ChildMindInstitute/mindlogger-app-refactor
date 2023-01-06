import { FC } from 'react';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback } from 'react-native';

import { SignUpForm } from '@features/sign-up';
import {
  StatusBar,
  KeyboardAvoidingView,
  Center,
  VStack,
  Flex,
} from '@shared/ui';

const SignUpScreen: FC = () => {
  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
          <StatusBar />

          <VStack h="100%" bg="primary.50">
            <Center>
              <Flex w="75%" mt={10}>
                <SignUpForm />
              </Flex>
            </Center>
          </VStack>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
