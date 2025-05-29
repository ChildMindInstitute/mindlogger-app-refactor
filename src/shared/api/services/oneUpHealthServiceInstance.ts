import { oneUpHealthService } from './oneUpHealthService';

let instance: ReturnType<typeof oneUpHealthService>;
export const getDefaultOneUpHealthService = () => {
  if (!instance) {
    instance = oneUpHealthService();
  }
  return instance;
};
