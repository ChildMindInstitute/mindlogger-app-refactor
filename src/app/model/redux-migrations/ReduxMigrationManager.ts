import { createMigrate, MigrationManifest } from 'redux-persist';

import { __queryClient__ } from '@app/app/ui/AppProvider/ReactQueryProvider';

import { ReduxMigratorStep1, RootStateV0 } from './ReduxMigratorStep1';

import type { RootStateV1 } from '.';

type MigrationState = RootStateV0 | RootStateV1;

type Migration = (prevState: MigrationState) => MigrationState;

type Migrations = Record<number, Migration>;

export interface IReduxMigrator {
  migrate: Migration;
}

const ReduxMigrationManager = {
  version: 1,
  createMigrate() {
    const migrations = {
      0: new ReduxMigratorStep1(__queryClient__).migrate,
    } satisfies Migrations as unknown as MigrationManifest;

    return createMigrate(migrations, {
      debug: __DEV__,
    });
  },
};

export default ReduxMigrationManager;
