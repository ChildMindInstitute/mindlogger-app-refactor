import { useMemo } from 'react';

import ToastMessage from 'react-native-toast-message';

const showToastMessage = (message: string) =>
  ToastMessage.show({
    type: 'toast',
    text1: message,
    position: 'bottom',
  });

function useToast() {
  const toast = useMemo(
    () => ({
      show: showToastMessage,
    }),
    [],
  );

  return toast;
}

export default useToast;
