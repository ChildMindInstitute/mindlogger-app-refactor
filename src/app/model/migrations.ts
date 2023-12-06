import { createMigrate, MigrationManifest } from 'redux-persist';

interface Migrations {
  [key: string]: (state: MigrationState) => MigrationState;
}

type MigrationState = RootStateV0 | RootStateV1;

type AppletsStateV0 = Omit<RootState['applets'], 'consents'>;
type RootStateV0 = Omit<RootState, 'applets'> & {
  applets: AppletsStateV0;
};

type RootStateV1 = RootState;

const migrations: Migrations = {
  0: (state: RootStateV0): RootStateV1 => {
    return {
      ...state,
      applets: {
        ...state.applets,
        consents: {},
      },
    };
  },
};

export const migrate = createMigrate(
  migrations as unknown as MigrationManifest,
  {
    debug: __DEV__,
  },
);
