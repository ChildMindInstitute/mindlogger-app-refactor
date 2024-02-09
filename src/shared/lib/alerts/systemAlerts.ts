import { Alert } from 'react-native';

export function onApiRequestError(errorMessage: string) {
  return new Promise((resolve) => {
    Alert.alert('Internal Server Error', errorMessage, [
      {
        text: 'Close',
        onPress: resolve,
      },
    ]);
  });
}
