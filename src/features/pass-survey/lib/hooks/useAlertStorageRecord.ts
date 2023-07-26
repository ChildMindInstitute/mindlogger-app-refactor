import { useCallback } from 'react';

import { useMMKVObject } from 'react-native-mmkv';

import { createSecureStorage } from '@app/shared/lib';

const storage = createSecureStorage('activity_alerts-storage');

type Config = {
  activityId: string;
  appletId: string;
  activityItemId: string;
  alertText: string;
};

type AlertState = Record<string, string[]>;

export function useAlertStorageRecord(config: Config) {
  const { appletId, activityId } = config;
  const key = `${appletId}-${activityId}`;

  const [alertStorageRecord, upsertAlertStorageRecord] = useMMKVObject(
    key,
    storage,
  );

  const clearAlertStorageRecord = useCallback(() => {
    storage.delete(key);
  }, [key]);

  const getCurrentActivityStorageRecord = useCallback(() => {
    const json = storage.getString(key);

    if (json) {
      return JSON.parse(json) as AlertState;
    }
  }, [key]);

  return {
    alertStorageRecord,
    upsertAlertStorageRecord,
    clearAlertStorageRecord,
    getCurrentActivityStorageRecord,
  };
}
