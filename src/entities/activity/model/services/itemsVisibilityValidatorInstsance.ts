import { getDefaultEntityActivitiesCollector } from './entityActivitiesCollectorInstance';
import { createItemsVisibilityValidator } from './ItemsVisibilityValidator';

let instance: ReturnType<typeof createItemsVisibilityValidator>;
export const getDefaultItemsVisibilityValidator = () => {
  if (!instance) {
    instance = createItemsVisibilityValidator(
      getDefaultEntityActivitiesCollector(),
    );
  }
  return instance;
};
