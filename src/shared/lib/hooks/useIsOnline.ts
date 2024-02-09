import { useNetInfo } from '@react-native-community/netinfo';

const useIsOnline = (): boolean => {
  const networkState = useNetInfo();

  const result =
    networkState.isConnected != null && networkState.isConnected && Boolean(networkState.isInternetReachable);

  return result;
};

export default useIsOnline;
