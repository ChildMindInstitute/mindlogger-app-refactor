import {
  RootStateFrom as RootState0000,
  RootStateTo as RootState0001,
} from './migrations/to0001/MigrationReduxTypes0001';
import {
  FlowStateFrom as FlowState0000,
  FlowStateTo as FlowState0001,
} from './migrations/to0001/MigrationStorageTypes0001';
import {
  RootStateTo as RootStateTo0002,
  RootStateFrom as RootStateFrom0002,
} from './migrations/to0002/MigrationReduxTypes0002.ts';
type FlowState = FlowState0000 | FlowState0001;

export type ReduxRootState =
  | RootState0000
  | RootState0001
  | RootStateTo0002
  | RootStateFrom0002;

export type MigrationInput = {
  reduxState: ReduxRootState;
};

type StorageKey = string;

export type FlowProgressStates = Record<StorageKey, FlowState>;

export const MigrationPrefix = 'migration--';

export enum Storages {
  FlowProgress = 'flow_progress-storage',
  ActivityProgress = 'activity_progress-storage',
  NotificationQueue = 'notification-queue',
  Localization = 'localization',
  System = 'system',
  AnalyticsStorage = 'analytics-storage',
}

export const StoragesArray = [
  Storages.ActivityProgress,
  Storages.AnalyticsStorage,
  Storages.FlowProgress,
  Storages.Localization,
  Storages.NotificationQueue,
  Storages.System,
];

export const SecureStoragesArray = [Storages.ActivityProgress];

export type MigrationOutput = {
  reduxState: ReduxRootState;
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
