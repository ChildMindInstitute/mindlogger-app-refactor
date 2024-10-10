import { setupLocalization } from '@app/entities/localization/lib/setupLocalization';
import { createJob } from '@app/shared/lib/services/jobManagement';

export default createJob(() => {
  return setupLocalization();
});
