import { MigrationToVersion0002 } from '@app/app/model/migrations/migrations/to0002/MigrationToVersion0002';
import { __queryClient__ } from '@app/app/ui/AppProvider/ReactQueryProvider';

import { MigrationToVersion0001 } from './migrations/to0001/MigrationToVersion0001';
import { IMigration } from './types';

type VersionFrom = number;

type Migrations = Record<VersionFrom, IMigration>;

export class MigrationFactory {
  public createMigrations(): Migrations {
    return {
      1: new MigrationToVersion0001(__queryClient__),
      2: new MigrationToVersion0002(__queryClient__),
    };
  }
}
