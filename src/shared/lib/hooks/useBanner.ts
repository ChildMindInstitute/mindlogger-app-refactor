import type { ToastOptions } from 'react-native-toast-notifications/lib/typescript/toast';

import useToast from './useToast';

export const useBanner = () => {
  const toast = useToast();
  return {
    ...toast,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    show: (content: string | JSX.Element, options: ToastOptions) => {
      toast.show(content as string);
    },
  };
};

export default useBanner;
