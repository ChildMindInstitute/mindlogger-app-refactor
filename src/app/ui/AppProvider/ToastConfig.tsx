import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import Toast, { ToastConfigParams } from 'react-native-toast-message';

import { palette } from '@app/shared/lib/constants/palette';

type ToastConfigProps = {
  content: string | JSX.Element;
};

export const ToastConfig = {
  toast: (props: ToastConfigParams<ToastConfigProps>) => (
    <View style={styles.defaultToast}>
      <View style={styles.row}>
        <View style={styles.toastText}>
          <Text numberOfLines={3} style={styles.defaultToastTextStyle}>
            {props.text1}
          </Text>
        </View>
      </View>
    </View>
  ),
  info: (props: ToastConfigParams<ToastConfigProps>) => (
    <View style={styles.infoToast}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>!</Text>
        </View>
        <View style={styles.infoToastText}>
          <Text numberOfLines={4} style={styles.infoToastTextStyle}>
            {props.text1}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => Toast.hide()}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  ),
};

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  defaultToast: {
    width: 340,
    flexDirection: 'row',
    minHeight: 50,
    backgroundColor: palette.toast_container,
    padding: 12,
    borderRadius: 5,
  },
  toastText: {
    justifyContent: 'center',
  },
  defaultToastTextStyle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: '400',
  },
  infoToast: {
    width: '90%',
    flexDirection: 'row',
    minHeight: 60,
    backgroundColor: '#FFF4D6',
    padding: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  infoToastText: {
    flex: 1,
    paddingVertical: 4,
  },
  infoToastTextStyle: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    flexShrink: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    color: palette.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  closeIcon: {
    color: '#333',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 28,
  },
});
