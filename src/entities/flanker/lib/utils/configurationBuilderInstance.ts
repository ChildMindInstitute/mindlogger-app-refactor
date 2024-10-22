import { createConfigurationBuilder } from './ConfigurationBuilder';

let instance: ReturnType<typeof createConfigurationBuilder>;
export const getDefaultConfigurationBuilder = () => {
  if (!instance) {
    instance = createConfigurationBuilder();
  }
  return instance;
};
