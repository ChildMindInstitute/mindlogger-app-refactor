import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import {
  IMigration,
  IMigrationRunner,
  MigrationInput,
  MigrationOutput,
} from './types';

export class MigrationRunner implements IMigrationRunner<unknown, unknown> {
  private migrations: Record<number, IMigration<unknown, unknown>>;

  constructor(migrations: Record<number, IMigration<unknown, unknown>>) {
    this.migrations = migrations;
  }

  private getMigrationKeys(
    currentVersion: number,
    inboundVersion: number,
  ): number[] {
    return Object.keys(this.migrations)
      .map(key => parseInt(key, 10))
      .filter(version => currentVersion >= version && version > inboundVersion)
      .sort((a, b) => a - b);
  }

  public async migrate(
    migrationInput: MigrationInput<unknown>,
    currentVersion: number,
    inboundVersion: number,
  ): Promise<MigrationOutput<unknown>> {
    const migrationKeys = this.getMigrationKeys(currentVersion, inboundVersion);

    getDefaultLogger().log(
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
        getDefaultLogger().warn(
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
