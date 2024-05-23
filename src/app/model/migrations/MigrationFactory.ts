import { __queryClient__ } from '@app/app/ui/AppProvider/ReactQueryProvider';

import { MigrationToVersion0001 } from './migrations/to0001/MigrationToVersion0001';
import { MigrationToVersion0003 } from './migrations/to0003/MigrationToVersion0003';
import { IMigration } from './types';

type VersionFrom = number;

type Migrations = Record<VersionFrom, IMigration>;

export class MigrationFactory {
  public createMigrations(): Migrations {
    return {
      1: new MigrationToVersion0001(__queryClient__),
      3: new MigrationToVersion0003(),
    };
  }
}
