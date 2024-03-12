import { createAction } from '@reduxjs/toolkit';

import { createStorage, SystemRecord } from '@app/shared/lib';

import {
  FlowProgressStates,
  IMigrationRunner,
  MigrationInput,
  MigrationOutput,
  ReduxRootState,
  StoragesStates,
} from './types';

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
    SystemRecord.setDataVersion(MigrationProcessor.version);
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
