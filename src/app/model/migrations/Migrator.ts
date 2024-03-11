import { Logger, SystemRecord } from '@shared/lib';

import {
  IMigration,
  IMigrator,
  MigrationInput,
  MigrationOutput,
} from './types';

const DEFAULT_VERSION = -1;

export class Migrator implements IMigrator {
  private migrations: Record<number, IMigration>;

  constructor(migrations: Record<number, IMigration>) {
    this.migrations = migrations;
  }

  private getInboundVersion(): number {
    return SystemRecord.getDataVersion() ?? DEFAULT_VERSION;
  }

  private getMigrationKeys(
    currentVersion: number,
    inboundVersion: number,
  ): number[] {
    return Object.keys(this.migrations)
      .map(parseInt)
      .filter(version => currentVersion >= version && version > inboundVersion)
      .sort((a, b) => a - b);
  }

  public async migrate(
    migrationInput: MigrationInput,
    currentVersion: number,
  ): Promise<MigrationOutput> {
    const inboundVersion = this.getInboundVersion();

    if (inboundVersion === currentVersion) {
      Logger.info('[Migrator]: versions match, noop migration');

      return migrationInput;
    }

    if (inboundVersion > currentVersion) {
      Logger.warn('[Migrator]: downgrading version is not supported');

      return migrationInput;
    }

    let migrationKeys = this.getMigrationKeys(currentVersion, inboundVersion);

    Logger.log(`[Migrator]: migrationKeys: ${migrationKeys}`);

    let reduxState = migrationInput.reduxState;
    let storagesStates = migrationInput.storagesStates;

    for (const version of migrationKeys) {
      const performMigration = () =>
        this.migrations[version].migrate({
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
  }
}
