import { queryClient } from '@shared/lib';

import { MigrationToVersion0001 } from './migrations/to0001/MigrationToVersion0001';
import { MigrationToVersion0002 } from './migrations/to0002/MigrationToVersion0002';
import { MigrationToVersion0003 } from './migrations/to0003/MigrationToVersion0003';
import { IMigration } from './types';

type VersionFrom = number;

type Migrations = Record<VersionFrom, IMigration>;

export class MigrationFactory {
  public createMigrations(): Migrations {
    return {
      1: new MigrationToVersion0001(queryClient),
      2: new MigrationToVersion0002(queryClient),
      3: new MigrationToVersion0003(queryClient),
    };
  }
}
