import { createStorage } from '@app/shared/lib';

import { FlowProgressMigrationManager } from './mmkv-migrations';

async function migrateFlowProgress() {
  const flowStorage = createStorage('flow_progress-storage');
  const migrate = FlowProgressMigrationManager.createMigrate();

  return migrate(flowStorage, FlowProgressMigrationManager.version);
}

async function preprocessStorages() {
  await migrateFlowProgress();
}

export default preprocessStorages;
