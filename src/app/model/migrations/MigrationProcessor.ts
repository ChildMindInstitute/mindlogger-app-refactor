import { createAction } from '@reduxjs/toolkit';
import { MMKV } from 'react-native-mmkv';

import { createStorage } from '@app/shared/lib';

import { MigrationFactory } from './MigrationFactory';
import {
  FlowProgressStates,
  MigrationInput,
  MigrationOutput,
  ReduxRootState,
  StoragesStates,
} from './types';
import { createMigrate, VERSION_KEY } from '../createMigrate';

type IReduxStore = {
  getState(): ReduxRootState;
  dispatch: AppDispatch;
};

export const migrateReduxStore = createAction<ReduxRootState>('@@MIGRATE');

export class MigrationProcessor {
  private systemStorage: MMKV;
  private reduxStore: IReduxStore;

  private static readonly version = 1;

  constructor(reduxStore: IReduxStore) {
    this.systemStorage = createStorage('system');
    this.reduxStore = reduxStore;
  }

  private getMigrationInput(): MigrationInput {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _persist, ...reduxState } = this.reduxStore.getState();
    const storagesStates: StoragesStates = {
      'flow_progress-storage': this.getStorageStates<FlowProgressStates['key']>(
        'flow_progress-storage',
      ),
    };

    return {
      reduxState,
      storagesStates,
    };
  }

  private getStorageStates<TState>(storageName: string) {
    const storage = createStorage(storageName);

    return storage.getAllKeys().reduce<Record<string, TState>>((state, key) => {
      state[key] = JSON.parse(storage.getString(key) ?? '{}');

      return state;
    }, {});
  }

  private updateVersion() {
    this.systemStorage.set(VERSION_KEY, MigrationProcessor.version);
  }

  private updateReduxStore(updatedState: ReduxRootState) {
    this.reduxStore.dispatch(migrateReduxStore(updatedState));
  }

  private updateStores(storagesStates: StoragesStates) {
    Object.entries(storagesStates).forEach(([storageName, statesMap]) => {
      const storage = createStorage(storageName);

      Object.entries(statesMap).forEach(([storageKey, state]) => {
        const json = JSON.stringify(state);

        storage.set(storageKey, json);
      });
    });
  }

  private commitChanges(migrationOutput: MigrationOutput) {
    this.updateReduxStore(migrationOutput.reduxState);
    this.updateStores(migrationOutput.storagesStates);
    this.updateVersion();
  }

  public async process() {
    const migrations = new MigrationFactory().createMigrations();
    const migrate = createMigrate(migrations);

    const migrationInput = this.getMigrationInput();
    const migrationOutput = await migrate(
      migrationInput,
      MigrationProcessor.version,
    );

    if (migrationInput !== migrationOutput) {
      return this.commitChanges(migrationOutput);
    }
  }
}
