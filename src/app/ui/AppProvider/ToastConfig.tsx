import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToastConfigParams } from 'react-native-toast-message';

import { colors } from '@app/shared/lib/constants/colors';
import { Box } from '@app/shared/ui/base';
import {
  MaterialAlertCircle,
  MaterialAlertOctagon,
  MaterialInformation,
  OcticonsCircleCheckFill,
} from '@app/shared/ui/icons';
import { Text } from '@app/shared/ui/Text';

type ToastUIProps = {
  toastStyle: { backgroundColor: string };
  icon: React.ReactNode;
  content: string | React.ReactNode;
};

const ToastUI = (props: ToastUIProps) => {
  const { top } = useSafeAreaInsets();

  let content: React.ReactNode;
  if (typeof props.content === 'string') {
    content = <Text numberOfLines={3}>{props.content}</Text>;
  } else {
    content = props.content;
  }

  return (
    <View
      style={[
        styles.baseToast,
        props.toastStyle,
        // eslint-disable-next-line react-native/no-inline-styles
        { paddingTop: top > 0 ? 0 : 12 },
      ]}
    >
      <View style={[styles.row, { paddingTop: top }]}>
        <View style={styles.toastIcon}>{props.icon}</View>

        <View style={[styles.toastText, styles.toastTextCenter]}>
          {content}
        </View>
      </View>
    </View>
  );
};

type ToastConfigProps = {
  content: string | JSX.Element;
};

export const ToastConfig = {
  success: (props: ToastConfigParams<ToastConfigProps>) => (
    <ToastUI
      toastStyle={styles.successToast}
      icon={
        <OcticonsCircleCheckFill color={colors.alertSuccessIcon} size={26} />
      }
      content={props.props.content}
    />
  ),
  error: (props: ToastConfigParams<ToastConfigProps>) => (
    <ToastUI
      toastStyle={styles.errorToast}
      icon={<MaterialAlertOctagon color={colors.alertErrorIcon} size={26} />}
      content={props.props.content}
    />
  ),
  warn: (props: ToastConfigParams<ToastConfigProps>) => (
    <ToastUI
      toastStyle={styles.warnToast}
      icon={<MaterialAlertCircle color={colors.alertWarnIcon} size={26} />}
      content={props.props.content}
    />
  ),
  info: (props: ToastConfigParams<ToastConfigProps>) => (
    <ToastUI
      toastStyle={styles.infoToast}
      icon={<MaterialInformation color={colors.alertInfoIcon} size={26} />}
      content={props.props.content}
    />
  ),
  toast: (props: ToastConfigParams<ToastConfigProps>) => (
    <Box style={styles.defaultToast}>
      <View style={styles.row}>
        <View style={styles.toastText}>
          <Text numberOfLines={3} style={{ color: colors.white }}>
            {props.text1}
          </Text>
        </View>
      </View>
    </Box>
  ),
};

export const styles = StyleSheet.create({
  baseToast: {
    width: '100%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  successToast: {
    backgroundColor: colors.alertSuccessBg,
  },
  errorToast: {
    backgroundColor: colors.alertErrorBg,
  },
  warnToast: {
    backgroundColor: colors.alertWarnBg,
  },
  infoToast: {
    backgroundColor: colors.alertInfoBg,
  },
  row: {
    flexDirection: 'row',
  },
  defaultToast: {
    width: 340,
    flexDirection: 'row',
    minHeight: 50,
    backgroundColor: colors.greyTsp,
    padding: 12,
    borderRadius: 5,
  },
  toastIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  toastText: {
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  toastTextCenter: {
    alignItems: 'center',
    flex: 1,
  },
});
