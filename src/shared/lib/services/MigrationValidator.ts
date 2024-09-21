import { MIGRATION_PROCESSOR_VERSION } from '@app/app/model/migrations';

import { SystemRecord } from '../records';

export const MigrationValidator = {
  allMigrationHaveBeenApplied: (): boolean => {
    const dataVersion = SystemRecord.getDataVersion();

    return !!dataVersion && dataVersion >= MIGRATION_PROCESSOR_VERSION;
  },
};
