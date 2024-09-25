import { getDefaultEntityActivitiesCollector } from './entityActivitiesCollectorInstance';
import { createMediaLookupService } from './MediaLookupService';

let instance: ReturnType<typeof createMediaLookupService>;
export const getDefaultMediaLookupService = () => {
  if (!instance) {
    instance = createMediaLookupService(getDefaultEntityActivitiesCollector());
  }
  return instance;
};
