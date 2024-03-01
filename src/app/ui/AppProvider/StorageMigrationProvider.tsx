import { PropsWithChildren, useEffect } from 'react';

import { useSystemBootUp } from '@app/shared/lib';

import { preprocessStorages } from '../../model';

function StorageMigrationProvider({ children }: PropsWithChildren<unknown>) {
  const { onModuleInitialized, initialized } = useSystemBootUp();

  useEffect(() => {
    preprocessStorages().then(() => onModuleInitialized('storage'));
  }, [onModuleInitialized]);

  return <>{initialized && children}</>;
}

export default StorageMigrationProvider;
