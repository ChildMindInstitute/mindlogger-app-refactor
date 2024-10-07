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

export type MigrationInput<TReduxRootState> = {
  reduxState: TReduxRootState;
};

export type MigrationOutput<TReduxRootState> = {
  reduxState: TReduxRootState;
};

export interface IMigration<TInputReduxRootState, TOutputReduxRootState> {
  migrate(
    input: MigrationInput<TInputReduxRootState>,
  ): MigrationOutput<TOutputReduxRootState>;
}

export interface IMigrationRunner<TInputReduxRootState, TOutputReduxRootState> {
  migrate(
    migrationInput: MigrationInput<TInputReduxRootState>,
    currentVersion: number,
    inboundVersion: number,
  ): Promise<MigrationOutput<TOutputReduxRootState>>;
}
