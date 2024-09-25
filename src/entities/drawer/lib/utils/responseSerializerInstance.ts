import { ResponseSerializer } from './serialization';

let instance: ReturnType<typeof ResponseSerializer>;
export const getDefaultResponseSerializer = () => {
  if (!instance) {
    instance = ResponseSerializer();
  }
  return instance;
};
