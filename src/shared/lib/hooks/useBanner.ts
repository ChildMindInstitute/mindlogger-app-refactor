import Toast from 'react-native-toast-message';
import type { ToastOptions } from 'react-native-toast-message/lib/src/types';

export const useBanner = () => {
  return {
    show: (content: string | JSX.Element, options: ToastOptions) => {
      Toast.hide();
      setTimeout(() => {
        Toast.show({
          props: { content },
          position: 'top',
          swipeable: false,
          ...options,
        });
      }, 200);
    },
  };
};

export default useBanner;
