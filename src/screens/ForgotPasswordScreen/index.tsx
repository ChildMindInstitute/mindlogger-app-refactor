import { FC } from 'react';
import { SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { ForgotPasswordForm } from '@features/forgot-password';
import {
  StatusBar,
  KeyboardAvoidingView,
  Center,
  VStack,
  Flex,
} from '@shared/ui';

const LoginScreen: FC = () => {
  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
          <StatusBar />

          <VStack h="100%" bg="primary.50">
            <Center>
              <Flex w="75%" mt={10}>
                <ForgotPasswordForm />
              </Flex>
            </Center>
          </VStack>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
