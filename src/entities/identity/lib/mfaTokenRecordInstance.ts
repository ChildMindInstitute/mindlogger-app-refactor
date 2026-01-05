import { MfaTokenRecord } from './mfaTokenRecord';

let defaultRecord: ReturnType<typeof MfaTokenRecord>;

export const getDefaultMfaTokenRecord = () => {
  if (!defaultRecord) {
    defaultRecord = MfaTokenRecord();
  }
  return defaultRecord;
};
