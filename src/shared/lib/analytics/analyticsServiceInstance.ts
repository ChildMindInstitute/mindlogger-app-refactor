import { AnalyticsService } from './AnalyticsService';
import { getDefaultLogger } from '../services/loggerInstance';
import { getDefaultStorageInstanceManager } from '../storages/storageInstanceManagerInstance';

let instance: AnalyticsService;
export const getDefaultAnalyticsService = () => {
  if (!instance) {
    instance = new AnalyticsService(
      getDefaultLogger(),
      getDefaultStorageInstanceManager().getAnalyticsStorage(),
    );
  }
  return instance;
};
