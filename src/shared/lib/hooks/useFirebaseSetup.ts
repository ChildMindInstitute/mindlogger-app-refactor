import { useEffect, useRef } from 'react';

import messaging from '@react-native-firebase/messaging';

type Callbacks = {
  onFCMTokenCreated: (token: string) => void;
};

async function useFirebaseSetup(callbacks: Callbacks) {
  const callbacksRef = useRef(callbacks);

  callbacksRef.current = callbacks;

  useEffect(() => {
    async function fetchToken() {
      try {
        const fcmToken = await messaging().getToken();

        callbacksRef.current.onFCMTokenCreated(fcmToken);
      } catch (error) {
        console.warn(
          'The app is running on an emulator. Hence, it cannot receive remote notifications',
        );
      }
    }

    fetchToken();

    return messaging().onTokenRefresh(token =>
      callbacksRef.current.onFCMTokenCreated(token),
    );
  }, []);
}

export default useFirebaseSetup;
