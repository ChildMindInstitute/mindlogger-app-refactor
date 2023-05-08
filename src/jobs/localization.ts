import { setupLocalization } from '@app/entities/localization';
import { createJob } from '@shared/lib';

export default createJob(() => {
  return setupLocalization();
});
