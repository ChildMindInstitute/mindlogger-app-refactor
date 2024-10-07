import { InterimSubmitMutex } from './interimSubmitMutex';

let instance: InterimSubmitMutex;
export const getDefaultInterimSubmitMutex = () => {
  if (!instance) {
    instance = new InterimSubmitMutex();
  }
  return instance;
};
