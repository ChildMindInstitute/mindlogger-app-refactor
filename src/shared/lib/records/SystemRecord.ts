import { createStorage } from '@shared/lib/storages';

const storage = createStorage('system');

const DEVICE_ID_KEY = 'deviceId';

function SystemRecord() {
  function getDeviceId() {
    return storage.getString(DEVICE_ID_KEY);
  }

  function setDeviceId(deviceId: string) {
    return storage.set(DEVICE_ID_KEY, deviceId);
  }

  return {
    getDeviceId,
    setDeviceId,
  };
}

export default SystemRecord();
