import { FC, PropsWithChildren } from 'react';

import { styled } from '@tamagui/core';
import ToastMessage, { BaseToastProps } from 'react-native-toast-message';

import { Box, Text } from '@app/shared/ui';

const ToastButton = styled(Box, {
  bg: '$greyTsp',
  minHeight: 50,
  borderRadius: 5,
  justifyContent: 'center',
  padding: 10,
});

type ToastProps = {
  message?: string;
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

const config = {
  dark: ({ text1 }: BaseToastProps) => <Toast message={text1} />,
};

const ToastProvider: FC<PropsWithChildren> = ({ children }) => (
  <>
    {children}
    <ToastMessage config={config} />
  </>
);

export default ToastProvider;
