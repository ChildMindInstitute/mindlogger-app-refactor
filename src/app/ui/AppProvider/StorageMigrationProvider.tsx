import { PropsWithChildren, useEffect } from 'react';

import { MigrationProcessor } from '@app/app/model/migrations/MigrationProcessor';
import { useSystemBootUp } from '@app/shared/lib';

import { reduxStore } from './ReduxProvider';

function StorageMigrationProvider({ children }: PropsWithChildren<unknown>) {
  const { onModuleInitialized, initialized } = useSystemBootUp();

  useEffect(() => {
    const migrationProcessor = new MigrationProcessor(reduxStore);

    migrationProcessor.process().then(() => onModuleInitialized('storage'));
  }, [onModuleInitialized]);

  return <>{initialized && children}</>;
}

export default StorageMigrationProvider;
