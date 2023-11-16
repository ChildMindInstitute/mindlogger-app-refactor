import { createStorage } from '@app/shared/lib';

export const storage = createStorage('analytics-storage');

export const clearAnalyticsStorage = () => {
  storage.clearAll();
};
