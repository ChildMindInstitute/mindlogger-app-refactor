import { IdentityService } from './identityService';

let instance: ReturnType<typeof IdentityService>;
export const getDefaultIdentityService = () => {
  if (!instance) {
    instance = IdentityService();
  }
  return instance;
};
