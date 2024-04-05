import Toast, { ToastOptions } from 'react-native-toast-message';

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
