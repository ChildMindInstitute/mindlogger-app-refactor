import {
  RootStateFrom as RootState0000,
  RootStateTo as RootState0001,
} from './migrations/to0001/MigrationReduxTypes0001';
import {
  FlowStateFrom as FlowState0000,
  FlowStateTo as FlowState0001,
} from './migrations/to0001/MigrationStorageTypes0001';

type FlowState = FlowState0000 | FlowState0001;

export type ReduxRootState = RootState0000 | RootState0001;

export type MigrationInput = {
  reduxState: ReduxRootState;
  storagesStates: StoragesStates;
};

type StorageKey = string;

export type FlowProgressStates = Record<StorageKey, FlowState>;

export type StoragesStates = {
  system?: Record<StorageKey, {}>;
  'flow_progress-storage'?: FlowProgressStates;
  'notification-queue'?: Record<StorageKey, {}>;
  localization?: Record<StorageKey, {}>;
  'activity_progress-storage'?: Record<StorageKey, {}>;
  'analytics-storage'?: Record<StorageKey, {}>;
};

export type MigrationOutput = {
  reduxState: ReduxRootState;
  storagesStates: StoragesStates;
};

export interface IMigration {
  migrate(input: MigrationInput): MigrationOutput;
}

export interface IMigrationRunner {
  migrate(
    migrationInput: MigrationInput,
    currentVersion: number,
    inboundVersion: number,
  ): Promise<MigrationOutput>;
}
