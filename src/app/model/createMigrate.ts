import { createStorage, Logger } from '@shared/lib';

import { IMigration, MigrationInput, MigrationOutput } from './migrations';

const DEFAULT_VERSION = 0;
export const VERSION_KEY = '__version__';

export function createMigrate(migrations: Record<number, IMigration>) {
  return async function migrate(
    migrationInput: MigrationInput,
    currentVersion: number,
  ): Promise<MigrationOutput> {
    const inboundVersion =
      createStorage('system').getNumber(VERSION_KEY) ?? DEFAULT_VERSION;

    if (inboundVersion === currentVersion) {
      Logger.info('[createMigrate]: versions match, noop migration');

      return migrationInput;
    }

    if (inboundVersion > currentVersion) {
      Logger.warn('[createMigrate]: downgrading version is not supported');

      return migrationInput;
    }

    let migrationKeys = Object.keys(migrations)
      .map(parseInt)
      .filter(version => currentVersion >= version && version > inboundVersion)
      .sort((a, b) => a - b);

    Logger.log(`[createMigrate]: migrationKeys: ${migrationKeys}`);

    let reduxState = migrationInput.reduxState;
    let storagesStates = migrationInput.storagesStates;

    for (const version of migrationKeys) {
      const performMigration = () =>
        migrations[version].migrate({
          reduxState: reduxState,
          storagesStates: storagesStates,
        });

      const migrationOutput = await Promise.resolve(performMigration());

      reduxState = migrationOutput.reduxState;
      storagesStates = migrationOutput.storagesStates;
    }

    return {
      reduxState,
      storagesStates,
    };
  };
}
