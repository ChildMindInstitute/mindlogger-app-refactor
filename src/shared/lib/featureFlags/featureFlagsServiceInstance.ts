import { FeatureFlagsService } from './FeatureFlagsService';
import { getDefaultLogger } from '../services/loggerInstance';

let instance: FeatureFlagsService;
export const getDefaultFeatureFlagsService = () => {
  if (!instance) {
    instance = new FeatureFlagsService(getDefaultLogger());
  }
  return instance;
};
