import { IMigration } from './types';

type Migrations = Record<number, IMigration>;

export class MigrationFactory {
  public createMigrations(): Migrations {
    return {} as Migrations;
  }
}
