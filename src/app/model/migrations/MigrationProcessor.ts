import { createAction } from '@reduxjs/toolkit';

import { SystemRecord } from '@app/shared/lib';

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

  private static readonly version = 1;

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

    const migrationOutput = await this.migrationRunner.migrate(
      migrationInput,
      MigrationProcessor.version,
      inboundVersion,
    );

    if (migrationInput !== migrationOutput) {
      return this.commitChanges(migrationOutput);
    }
  }
}
