import { Logger } from '@shared/lib';

import { IMigration, MigrationInput, MigrationOutput } from '../../types.ts';

type RootStateFrom = {
  applets: {
    inProgress: any;
    completedEntities: any;
    completions: any;
  };
  streaming: any;
  identity: any;
};

export type RootStateTo = {
  applets: {
    inProgress: any;
    completedEntities: any;
    completions: any;
    consents: {};
  };
  streaming: any;
  identity: any;
};

export class MigrationToVersion0003 implements IMigration {
  public migrate(input: MigrationInput): MigrationOutput {
    const result: MigrationOutput = {
      reduxState: { ...input.reduxState } as RootStateFrom,
    };

    try {
      result.reduxState = {
        ...input.reduxState,
        applets: {
          ...input.reduxState.applets,
          consents: {},
        },
      };
    } catch (error) {
      Logger.warn(
        `[MigrationToVersion0003.migrate]: Error occurred, LORIS consents field migration \nerror: \n${error}`,
      );
    }

    return result;
  }
}
