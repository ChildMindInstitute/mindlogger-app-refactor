import { MMKV } from 'react-native-mmkv';

import { ISystemRecord } from './ISystemRecord';

const DEVICE_ID_KEY = 'deviceId';
const DATA_VERSION_KEY = 'dataVersion';

export function SystemRecord(systemStorage: MMKV): ISystemRecord {
  function getDeviceId() {
    return systemStorage.getString(DEVICE_ID_KEY) as string;
  }

  function setDeviceId(deviceId: string) {
    systemStorage.set(DEVICE_ID_KEY, deviceId);
  }

  function getDataVersion() {
    return systemStorage.getNumber(DATA_VERSION_KEY) as number;
  }

  function setDataVersion(version: number) {
    systemStorage.set(DATA_VERSION_KEY, version);
  }

  return {
    getDeviceId,
    setDeviceId,

    getDataVersion,
    setDataVersion,
  };
}
