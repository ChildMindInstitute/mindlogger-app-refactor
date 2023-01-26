import { useSyncExternalStore } from 'react';

import storage from '../storage';

function useSession() {
  return useSyncExternalStore(storage.subscribe, storage.getSession);
}

export default useSession;
