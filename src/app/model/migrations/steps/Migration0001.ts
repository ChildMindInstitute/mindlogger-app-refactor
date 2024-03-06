import { MigrationInput0000, MigrationOutput0001 } from './types/types0001';
import { IMigration } from '../types';

export class Migration0001 implements IMigration {
  public migrate(input: MigrationInput0000): MigrationOutput0001 {
    console.log(input);
    return {} as MigrationOutput0001;
  }
}
