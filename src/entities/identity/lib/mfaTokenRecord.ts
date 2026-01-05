import { MMKV } from 'react-native-mmkv';

import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { MfaTokenData } from '../types/mfaToken';

const MFA_TOKEN_KEY = 'mfaToken';

export function MfaTokenRecord() {
  const storage: MMKV = getDefaultStorageInstanceManager().getMfaTokenStorage();

  function setToken(data: MfaTokenData): void {
    storage.set(MFA_TOKEN_KEY, JSON.stringify(data));
  }

  function getToken(): MfaTokenData | null {
    try {
      const json = storage.getString(MFA_TOKEN_KEY);
      if (!json) return null;

      const data = JSON.parse(json) as MfaTokenData;

      if (!data.mfaToken || !data.email || !data.timestamp) {
        clear();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to parse MFA token:', error);
      clear();
      return null;
    }
  }

  function clear(): void {
    storage.delete(MFA_TOKEN_KEY);
  }

  return {
    setToken,
    getToken,
    clear,
  };
}
