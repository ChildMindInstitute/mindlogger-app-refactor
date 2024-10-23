import { Alert, Linking } from 'react-native';

export const openUrl = (url: string) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Alert', 'Unable to open url');
    }
  });
};
