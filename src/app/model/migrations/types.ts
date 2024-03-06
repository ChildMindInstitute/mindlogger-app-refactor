import { FlowState0000, FlowState0001 } from './steps/types/types0001';

type FlowStateOfSpecificVersion = FlowState0000 | FlowState0001;

export type MigrationInput = {
  redux?: ReduxSnippet;
};

export type MigrationOutput = {
  redux?: ReduxSnippet;
  flowStateRecords?: Record<string, FlowStateOfSpecificVersion>;
};

export type Excluded = 'excluded';

export type ReduxSubSnippet = Record<string, any | Excluded>;

export type ReduxSnippet = Record<string, ReduxSubSnippet | Excluded>;

export interface IMigration {
  migrate(input: MigrationInput): MigrationOutput;
}
