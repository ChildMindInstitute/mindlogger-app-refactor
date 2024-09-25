export type ISystemRecord = {
  getDeviceId: () => string;
  setDeviceId: (deviceId: string) => void;
  getDataVersion: () => number;
  setDataVersion: (version: number) => void;
};
