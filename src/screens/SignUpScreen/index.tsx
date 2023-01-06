import { FC } from 'react';
import { SafeAreaView } from 'react-native';

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
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
