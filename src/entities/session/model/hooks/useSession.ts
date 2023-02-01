import { useSyncExternalStore } from 'react';

import { memoizeSession } from '../../lib';
import storage from '../storage';

const getSession = memoizeSession(storage.getSession);

function useSession() {
  return useSyncExternalStore(storage.subscribe, getSession);
}

export default useSession;
