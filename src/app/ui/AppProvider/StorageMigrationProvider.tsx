import { PropsWithChildren, useEffect } from 'react';

import { MigrationFactory } from '@app/app/model/migrations/MigrationFactory';
import { MigrationProcessor } from '@app/app/model/migrations/MigrationProcessor';
import { MigrationRunner } from '@app/app/model/migrations/MigrationRunner';
import { useSystemBootUp } from '@app/shared/lib/contexts/SplashContext';

import { reduxStore } from './ReduxProvider';

export function StorageMigrationProvider({
  children,
}: PropsWithChildren<unknown>) {
  const { onModuleInitialized, initialized } = useSystemBootUp();

  useEffect(() => {
    const migrations = new MigrationFactory().createMigrations();
    const migrator = new MigrationRunner(migrations);
    const migrationProcessor = new MigrationProcessor(reduxStore, migrator);

    migrationProcessor
      .process()
      .then(() => onModuleInitialized('storage'))
      .catch(console.error);
  }, [onModuleInitialized]);

  return <>{initialized && children}</>;
}
