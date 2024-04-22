import { __queryClient__ } from '@app/app/ui/AppProvider/ReactQueryProvider';

import { MigrationToVersion0001 } from './migrations/to0001/MigrationToVersion0001';
import { MigrationToVersion0002 } from './migrations/to0002/MigrationToVersion0002';
import { IMigration } from './types';

type VersionFrom = number;

type Migrations = Record<VersionFrom, IMigration>;

export class MigrationFactory {
  public createMigrations(): Migrations {
    return {
      0: new MigrationToVersion0001(__queryClient__),
      1: new MigrationToVersion0002(),
    };
  }
}
