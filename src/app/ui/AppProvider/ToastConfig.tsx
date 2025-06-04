import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ToastConfigParams } from 'react-native-toast-message';

import { colors } from '@app/shared/lib/constants/colors';
import { Box } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

type ToastConfigProps = {
  content: string | JSX.Element;
};

export const ToastConfig = {
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
  toastText: {
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
});
