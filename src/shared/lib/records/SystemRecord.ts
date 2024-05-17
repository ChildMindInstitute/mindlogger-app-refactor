import { createStorage } from '@shared/lib/storages';

const storage = createStorage('system');

const DEVICE_ID_KEY = 'deviceId';
const DATA_VERSION_KEY = 'dataVersion';

function SystemRecord() {
  function getDeviceId() {
    return storage.getString(DEVICE_ID_KEY);
  }

  function setDeviceId(deviceId: string) {
    storage.set(DEVICE_ID_KEY, deviceId);
  }

  function getDataVersion() {
    return storage.getNumber(DATA_VERSION_KEY);
  }

  function setDataVersion(version: number) {
    storage.set(DATA_VERSION_KEY, version);
  }

  return {
    getDeviceId,
    setDeviceId,

    getDataVersion,
    setDataVersion,
  };
}

export default SystemRecord();
