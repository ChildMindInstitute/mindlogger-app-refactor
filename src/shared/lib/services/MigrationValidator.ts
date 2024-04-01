import { MIGRATION_PROCESSOR_VERSION } from '../constants';
import { SystemRecord } from '../records';

export const MigrationValidator = {
  allMigrationHaveBeenApplied: (): boolean => {
    return SystemRecord.getDataVersion() === MIGRATION_PROCESSOR_VERSION;
  },
};
