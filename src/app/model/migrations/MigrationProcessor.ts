import { createAction } from '@reduxjs/toolkit';

import { Logger, SystemRecord } from '@app/shared/lib';

import {
  IMigrationRunner,
  MigrationInput,
  MigrationOutput,
  StoragesArray,
} from './types';
import { createMigrationStorage, createRegularStorage } from './utils';
import { MIGRATION_PROCESSOR_VERSION } from './version';

type IReduxStore = {
  getState(): unknown;
  dispatch: AppDispatch;
};

const DEFAULT_VERSION = -1;

export const migrateReduxStore = createAction<unknown>('@@MIGRATE');

export class MigrationProcessor {
  private reduxStore: IReduxStore;
  private migrationRunner: IMigrationRunner<unknown, unknown>;

  private static readonly version = MIGRATION_PROCESSOR_VERSION;

  constructor(
    reduxStore: IReduxStore,
    migrationRunner: IMigrationRunner<unknown, unknown>,
  ) {
    this.reduxStore = reduxStore;
    this.migrationRunner = migrationRunner;
  }

  private getInboundVersion(): number {
    return SystemRecord.getDataVersion() ?? DEFAULT_VERSION;
  }

  private getMigrationInput<TRootState>(): MigrationInput<TRootState> {
    // @ts-ignore
    const { _persist, ...reduxState } = this.reduxStore.getState();

    return {
      reduxState: reduxState as TRootState,
    };
  }

  private updateVersion() {
    SystemRecord.setDataVersion(MigrationProcessor.version);
  }

  private updateReduxStore<TRootState>(updatedState: TRootState) {
    this.reduxStore.dispatch(migrateReduxStore(updatedState));
  }

  private updateStorages() {
    const storageNames = StoragesArray;

    for (const storageName of storageNames) {
      const migrationStorage = createMigrationStorage(storageName);
      const regularStorage = createRegularStorage(storageName);
      const keys = migrationStorage.getAllKeys();

      for (const key of keys) {
        const value = migrationStorage.getString(key)!;
        regularStorage.set(key, value);
      }
    }
  }

  private commitChanges<TRootState>(
    migrationOutput: MigrationOutput<TRootState>,
  ) {
    this.updateReduxStore(migrationOutput.reduxState);
    this.updateStorages();
    this.updateVersion();
  }

  private prepareStorages() {
    const storageNames = StoragesArray;

    for (const storageName of storageNames) {
      const storage = createMigrationStorage(storageName);
      storage.clearAll();
    }
  }

  public async process() {
    const inboundVersion = this.getInboundVersion();

    const currentVersion = MigrationProcessor.version;

    Logger.log(
      `[MigrationProcessor] inboundVersion=${inboundVersion}, currentVersion=${currentVersion}`,
    );

    if (inboundVersion === currentVersion) {
      Logger.info('[MigrationRunner]: Versions match, noop migration');
      return;
    }

    if (inboundVersion > currentVersion) {
      Logger.info('[MigrationRunner]: Downgrading version is not supported');
      return;
    }

    try {
      Logger.info('[MigrationProcessor] Start executing migrations');

      this.prepareStorages();

      const migrationInput = this.getMigrationInput();

      const migrationOutput = await this.migrationRunner.migrate(
        migrationInput,
        currentVersion,
        inboundVersion,
      );

      Logger.info('[MigrationProcessor] Complete');

      if (migrationInput !== migrationOutput) {
        Logger.info('[MigrationProcessor] Commit changes');

        return this.commitChanges(migrationOutput);
      }
    } catch (error) {
      Logger.warn('[MigrationProcessor] Error occurred: \n\n' + error);
    }
    await Logger.send();
  }
}
