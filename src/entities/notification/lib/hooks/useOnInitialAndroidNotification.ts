import { useEffect, useRef } from 'react';

import notifee from '@notifee/react-native';

import { IS_ANDROID } from '@app/shared/lib';

import { LocalInitialNotification } from '../types';

export function useOnInitialAndroidNotification(
  callback: (initialNotification: LocalInitialNotification) => void,
) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  async function checkInitialNotification() {
    const notification = await notifee.getInitialNotification();

    if (notification) {
      callbackRef.current(notification as LocalInitialNotification);
    }
  }

  useEffect(() => {
    if (IS_ANDROID) {
      checkInitialNotification();
    }
  }, []);
}
