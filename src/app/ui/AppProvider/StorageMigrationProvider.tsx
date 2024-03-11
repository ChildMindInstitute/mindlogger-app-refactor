import { PropsWithChildren, useEffect } from 'react';

import { MigrationProcessor } from '@app/app/model';
import { useSystemBootUp } from '@app/shared/lib';

import { reduxStore } from './ReduxProvider';
import { Migrator, MigrationFactory } from '../../model';

function StorageMigrationProvider({ children }: PropsWithChildren<unknown>) {
  const { onModuleInitialized, initialized } = useSystemBootUp();

  useEffect(() => {
    const migrations = new MigrationFactory().createMigrations();
    const migrator = new Migrator(migrations);
    const migrationProcessor = new MigrationProcessor(reduxStore, migrator);

    migrationProcessor.process().then(() => onModuleInitialized('storage'));
  }, [onModuleInitialized]);

  return <>{initialized && children}</>;
}

export default StorageMigrationProvider;
