import { MMKV } from 'react-native-mmkv';

import { Logger } from '../services';

const DEFAULT_VERSION = -1;
const VERSION_KEY = '__version__';

type Migration<TState> = (prevState: TState, storageKey: string) => TState;

export function createMigrate<TState>(
  migrations: Record<number, Migration<TState>>,
) {
  return function (storage: MMKV, currentVersion: number): Promise<MMKV> {
    const inboundVersion = storage.getNumber(VERSION_KEY) ?? DEFAULT_VERSION;

    if (inboundVersion === currentVersion) {
      Logger.info('[createMigrate]: versions match, noop migration');

      return Promise.resolve(storage);
    }

    if (inboundVersion > currentVersion) {
      Logger.warn('[createMigrate]: downgrading version is not supported');

      return Promise.resolve(storage);
    }

    let migrationKeys = Object.keys(migrations)
      .map(parseInt)
      .filter(version => currentVersion >= version && version > inboundVersion)
      .sort((a, b) => a - b);

    Logger.log(`[createMigrate]: migrationKeys: ${migrationKeys}`);

    for (const key of storage.getAllKeys()) {
      if (key === VERSION_KEY) {
        continue;
      }

      try {
        const json = storage.getString(key)!;
        const originalRecord = JSON.parse(json) as TState;

        let migratedRecord = migrationKeys.reduce(
          (stateToMigrate, versionKey) => {
            Logger.log(
              `[createMigrate]: running migration for versionKey: ${versionKey}`,
            );

            return migrations[versionKey](stateToMigrate, key);
          },
          originalRecord,
        );

        if (migratedRecord) {
          storage.set(key, JSON.stringify(migratedRecord));
        }

        storage.set(VERSION_KEY, currentVersion);
      } catch (error) {
        Logger.error(
          `[createMigrate] Failed attempt to migrate record: ${key}
          Error: ${error}
          `,
        );
      }
    }

    return Promise.resolve(storage);
  };
}
