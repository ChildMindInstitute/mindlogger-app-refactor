import { createEntityActivitiesCollector } from './EntityActivitiesCollector';

let instance: ReturnType<typeof createEntityActivitiesCollector>;
export const getDefaultEntityActivitiesCollector = () => {
  if (!instance) {
    instance = createEntityActivitiesCollector();
  }
  return instance;
};
