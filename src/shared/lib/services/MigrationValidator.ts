import { MIGRATION_PROCESSOR_VERSION } from '@app/app/model/migrations/version';

import { getDefaultSystemRecord } from '../records/systemRecordInstance';

export const MigrationValidator = {
  allMigrationHaveBeenApplied: (): boolean => {
    const dataVersion = getDefaultSystemRecord().getDataVersion();

    return !!dataVersion && dataVersion >= MIGRATION_PROCESSOR_VERSION;
  },
};
