import { useMMKVObject } from 'react-native-mmkv';

import { sessionService } from '../../lib';
import { Session } from '../../types';

function useSession() {
  const [session] = useMMKVObject<Session>('sessionKeys', sessionService.getStorage());

  return session;
}

export default useSession;
