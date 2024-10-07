import { activityService } from './activityService';

let instance: ReturnType<typeof activityService>;
export const getDefaultActivityService = () => {
  if (!instance) {
    instance = activityService();
  }
  return instance;
};
