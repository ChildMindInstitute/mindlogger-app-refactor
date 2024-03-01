import { __queryClient__ } from '@app/app/ui/AppProvider/ReactQueryProvider';
import { createMigrate } from '@app/shared/lib';

import { FlowProgressMigratorStep1 } from './FlowProgressMigratorStep1';

import { FlowStateV0, FlowStateV1 } from '.';

type MigrationState = FlowStateV0 | FlowStateV1;

type Migration = (
  prevState: MigrationState,
  storageKey: string,
) => MigrationState;

type Migrations = Record<number, Migration>;

export type IFlowProgressMigrator = {
  migrate: Migration;
};

const FlowProgressMigrationManager = {
  version: 1,
  createMigrate() {
    const migrations = {
      0: new FlowProgressMigratorStep1(__queryClient__).migrate,
    } satisfies Migrations;

    return createMigrate(migrations);
  },
};

export default FlowProgressMigrationManager;
