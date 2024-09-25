import { useMMKVObject } from 'react-native-mmkv';

import { getDefaultSessionService } from '../../lib/sessionServiceInstance';
import { Session } from '../../types';

export function useSession() {
  const [session] = useMMKVObject<Session>(
    'sessionKeys',
    getDefaultSessionService().getStorage(),
  );

  return session;
}
