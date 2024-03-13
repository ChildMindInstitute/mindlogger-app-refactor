import { createAction } from '@reduxjs/toolkit';

import {
  Logger,
  MIGRATION_PROCESSOR_VERSION,
  SystemRecord,
} from '@app/shared/lib';

import {
  IMigrationRunner,
  MigrationInput,
  MigrationOutput,
  ReduxRootState,
  StoragesArray,
} from './types';
import { createMigrationStorage, createRegularStorage } from './utils';

type IReduxStore = {
  getState(): ReduxRootState;
  dispatch: AppDispatch;
};

const DEFAULT_VERSION = -1;

export const migrateReduxStore = createAction<ReduxRootState>('@@MIGRATE');

export class MigrationProcessor {
  private reduxStore: IReduxStore;
  private migrationRunner: IMigrationRunner;

  private static readonly version = MIGRATION_PROCESSOR_VERSION;

  constructor(reduxStore: IReduxStore, migrationRunner: IMigrationRunner) {
    this.reduxStore = reduxStore;
    this.migrationRunner = migrationRunner;
  }

  private getInboundVersion(): number {
    return SystemRecord.getDataVersion() ?? DEFAULT_VERSION;
  }

  private getMigrationInput(): MigrationInput {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _persist, ...reduxState } = this.reduxStore.getState();

    return {
      reduxState,
    };
  }

  private updateVersion() {
    SystemRecord.setDataVersion(MigrationProcessor.version);
  }

  private updateReduxStore(updatedState: ReduxRootState) {
    this.reduxStore.dispatch(migrateReduxStore(updatedState));
  }

  private updateStorages() {
    const storageNames = StoragesArray;

    for (let storageName of storageNames) {
      const migrationStorage = createMigrationStorage(storageName);
      const regularStorage = createRegularStorage(storageName);
      const keys = migrationStorage.getAllKeys();

      for (let key of keys) {
        const value = migrationStorage.getString(key)!;
        regularStorage.set(key, value);
      }
    }
  }

  private commitChanges(migrationOutput: MigrationOutput) {
    this.updateReduxStore(migrationOutput.reduxState);
    this.updateStorages();
    this.updateVersion();
  }

  private prepareStorages() {
    const storageNames = StoragesArray;

    for (let storageName of storageNames) {
      const storage = createMigrationStorage(storageName);
      storage.clearAll();
    }
  }

  public async process() {
    this.prepareStorages();
    const migrationInput = this.getMigrationInput();
    const inboundVersion = this.getInboundVersion();

    try {
      Logger.info('[MigrationProcessor] Start executing migrations');

      const migrationOutput = await this.migrationRunner.migrate(
        migrationInput,
        MigrationProcessor.version,
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
  }
}
