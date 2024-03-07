import {
  FlowState0000,
  FlowState0001,
  RootState0000,
  RootState0001,
} from './migrations/to0001/MigrationTypes0001';

type FlowState = FlowState0000 | FlowState0001;

type ReduxRootState = RootState0000 | RootState0001;

export type MigrationInput = {
  redux?: ReduxRootState;
};

export type MigrationOutput = {
  redux?: any;
  flowStateRecords?: Record<string, FlowState>;
};

export interface IMigration {
  migrate(input: MigrationInput): MigrationOutput;
}
