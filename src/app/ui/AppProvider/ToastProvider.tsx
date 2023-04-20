import { FC, PropsWithChildren } from 'react';

import { styled } from '@tamagui/core';
import { ToastProvider as RNTNToastProvider } from 'react-native-toast-notifications';

import { Box, Text } from '@app/shared/ui';

const ToastButton = styled(Box, {
  bg: '$greyTsp',
  minHeight: 50,
  borderRadius: 5,
  justifyContent: 'center',
  padding: 10,
});

type ToastProps = {
  message: string | JSX.Element;
};

const Toast: FC<ToastProps> = ({ message }) => (
  <Box width="100%" pr={10} pl={10}>
    <ToastButton>
      <Text color="$white" fontSize={18}>
        {message}
      </Text>
    </ToastButton>
  </Box>
);

const ToastProvider: FC<PropsWithChildren> = ({ children }) => (
  <RNTNToastProvider
    offsetBottom={20}
    renderToast={({ message }) => {
      return <Toast message={message} />;
    }}
  >
    {children}
  </RNTNToastProvider>
);

export default ToastProvider;
