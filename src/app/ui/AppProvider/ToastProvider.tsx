import { FC, PropsWithChildren } from 'react';

import { styled } from '@tamagui/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ToastMessage, { BaseToastProps } from 'react-native-toast-message';
import { ToastProvider as RNTNToastProvider } from 'react-native-toast-notifications';

import { IS_IOS, colors } from '@app/shared/lib';
import {
  Box,
  Text,
  MaterialAlertCircle,
  MaterialInformation,
  MaterialAlertOctagon,
  OcticonsCircleCheckFill,
} from '@app/shared/ui';

const ToastButton = styled(Box, {
  bg: '$greyTsp',
  minHeight: 50,
  borderRadius: 5,
  justifyContent: 'center',
  padding: 10,
});

type ToastProps = {
  message: string | JSX.Element;
  icon?: JSX.Element;
  type?: string;
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

const getDefaultBannerProps = (props: ToastProps) => {
  let type = props.type?.replace('banner', '').toLowerCase(),
    icon = props.icon,
    bgColor = '';

  switch (type) {
    case 'success':
      icon = (
        <OcticonsCircleCheckFill color={colors.alertSuccessIcon} size={24} />
      );
      bgColor = colors.alertSuccessBg;
      break;
    case 'danger':
      icon = <MaterialAlertOctagon color={colors.alertErrorIcon} size={26} />;
      bgColor = colors.alertErrorBg;
      break;
    case 'warn':
      icon = <MaterialAlertCircle color={colors.alertWarnIcon} size={26} />;
      bgColor = colors.alertWarnBg;
      break;
    case 'info':
    default:
      icon = <MaterialInformation color={colors.alertInfoIcon} size={26} />;
      bgColor = colors.alertInfoBg;
      break;
  }

  return { icon, type, bgColor };
};

const Banner: FC<ToastProps> = (props: ToastProps) => {
  const { top } = useSafeAreaInsets();
  const { icon, bgColor } = getDefaultBannerProps(props);
  return (
    <Box
      backgroundColor={bgColor}
      width="100%"
      py={12}
      pt={IS_IOS ? top + 12 : 12}
      px={20}
      mt={IS_IOS ? -top : -12}
    >
      <Box
        flex={1}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
      >
        <Box mr={14}>{icon}</Box>
        <Text>{props.message}</Text>
      </Box>
    </Box>
  );
};

const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const { top } = useSafeAreaInsets();
  return (
    <RNTNToastProvider
      offsetBottom={20}
      offsetTop={top}
      renderToast={props => {
        return props.data?.banner ? (
          <Banner {...props} />
        ) : (
          <Toast {...props} />
        );
      }}
    >
      {children}
    </RNTNToastProvider>
  );
};

const config = {
  dark: ({ text1 }: BaseToastProps) => <Toast message={text1!} />,
};

export const ToastProvider_NewImplementation: FC<PropsWithChildren> = ({
  children,
}) => (
  <>
    {children}
    <ToastMessage config={config} />
  </>
);

export default ToastProvider;
