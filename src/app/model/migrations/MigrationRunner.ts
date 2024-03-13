import { Logger } from '@shared/lib';

import {
  IMigration,
  IMigrationRunner,
  MigrationInput,
  MigrationOutput,
} from './types';

export class MigrationRunner implements IMigrationRunner {
  private migrations: Record<number, IMigration>;

  constructor(migrations: Record<number, IMigration>) {
    this.migrations = migrations;
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
    inboundVersion: number,
  ): Promise<MigrationOutput> {
    let migrationKeys = this.getMigrationKeys(currentVersion, inboundVersion);

    Logger.log(
      `[MigrationRunner]: migrationKeys: [${migrationKeys}]${
        migrationKeys.length === 0 ? ', no need to run migrations' : ''
      }`,
    );

    let reduxState = migrationInput.reduxState;

    for (const version of migrationKeys) {
      const performMigration = () =>
        this.migrations[version].migrate({
          reduxState: reduxState,
        });

      try {
        const migrationOutput = await Promise.resolve(performMigration());
        reduxState = migrationOutput.reduxState;
      } catch (error) {
        Logger.warn(
          `[MigrationRunner.performMigration] Error occurred during execution migration v${version}: \n\n${error}`,
        );
        throw error;
      }
    }

    return {
      reduxState,
    };
  }
}
