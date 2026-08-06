import type * as KeyManagerModule from '../mmkvEncryptionKeyManager';

// jest.setup.js mocks the key manager globally for all other tests; this
// suite tests the real implementation.
jest.unmock('@app/shared/lib/storages/mmkvEncryptionKeyManager');

let mockLegacyKey: string | undefined;

jest.mock('@app/shared/lib/constants', () => ({
  ...jest.requireActual<Record<string, unknown>>('@app/shared/lib/constants'),
  get LEGACY_STORE_ENCRYPTION_KEY() {
    return mockLegacyKey;
  },
}));

const mockLoggerError = jest.fn();

jest.mock('@app/shared/lib/services/loggerInstance', () => ({
  getDefaultLogger: () => ({
    log: jest.fn(),
    warn: jest.fn(),
    error: mockLoggerError,
  }),
}));

type MockStore = {
  id: string;
  data: Map<string, unknown>;
  getBoolean: (key: string) => boolean | undefined;
  set: (key: string, value: unknown) => void;
  encrypt: jest.Mock;
};

type MockCreateCall = {
  id: string;
  encryptionKey?: string;
  encryptionType?: string;
};

// Registry keyed by id, replicating the native behavior where reopening the
// same id returns the cached instance.
const mockMMKVState = {
  stores: new Map<string, MockStore>(),
  createCalls: [] as MockCreateCall[],
  existingIds: new Set<string>(),
  deletedIds: [] as string[],
  failingEncryptIds: new Set<string>(),
};

jest.mock('react-native-mmkv', () => ({
  createMMKV: (config: MockCreateCall): MockStore => {
    mockMMKVState.createCalls.push({ ...config });

    let store = mockMMKVState.stores.get(config.id);
    if (!store) {
      const data = new Map<string, unknown>();
      store = {
        id: config.id,
        data,
        getBoolean: (key: string) => {
          const value = data.get(key);
          return typeof value === 'boolean' ? value : undefined;
        },
        set: (key: string, value: unknown) => {
          data.set(key, value);
        },
        encrypt: jest.fn(() => {
          if (mockMMKVState.failingEncryptIds.has(config.id)) {
            throw new Error(`Failed to recrypt ${config.id}`);
          }
        }),
      };
      mockMMKVState.stores.set(config.id, store);
    }
    return store;
  },
  existsMMKV: (id: string) => mockMMKVState.existingIds.has(id),
  deleteMMKV: (id: string) => {
    mockMMKVState.deletedIds.push(id);
    mockMMKVState.stores.delete(id);
    return true;
  },
}));

type Constants = typeof import('@app/shared/lib/constants');

type MockedKeychain = {
  getGenericPassword: jest.Mock<
    Promise<false | { password: string }>,
    [unknown?]
  >;
  setGenericPassword: jest.Mock<
    Promise<unknown>,
    [string, string, Record<string, unknown>]
  >;
};

// The key manager caches the resolved key in module scope, so every test
// loads a fresh copy of the module (and of the mocked keychain it talks to).
function setup() {
  jest.resetModules();

  const keychain = require('react-native-keychain') as MockedKeychain;
  const mmkv = require('react-native-mmkv') as {
    createMMKV: (config: MockCreateCall) => MockStore;
  };
  const constants = require('@app/shared/lib/constants') as Constants;
  const manager =
    require('../mmkvEncryptionKeyManager') as typeof KeyManagerModule;

  return { keychain, mmkv, constants, manager };
}

function getSystemStore(): MockStore | undefined {
  return mockMMKVState.stores.get('system');
}

function markerFor(manager: typeof KeyManagerModule, id: string): string {
  return `${manager.STORAGE_ENCRYPTION_MIGRATION_MARKER_PREFIX}${id}`;
}

describe('mmkvEncryptionKeyManager', () => {
  beforeEach(() => {
    mockLegacyKey = undefined;
    mockMMKVState.stores.clear();
    mockMMKVState.createCalls.length = 0;
    mockMMKVState.existingIds.clear();
    mockMMKVState.deletedIds.length = 0;
    mockMMKVState.failingEncryptIds.clear();
  });

  it('generates a 32-char hex key and persists it to the keychain on fresh install', async () => {
    const { keychain, constants, manager } = setup();

    await manager.initializeStorageEncryption();

    expect(keychain.setGenericPassword).toHaveBeenCalledTimes(1);
    expect(keychain.setGenericPassword).toHaveBeenCalledWith(
      constants.STORAGE_ENCRYPTION_KEYCHAIN_USERNAME,
      expect.stringMatching(/^[0-9a-f]{32}$/),
      {
        service: constants.STORAGE_ENCRYPTION_KEYCHAIN_SERVICE,
        accessible: 'AccessibleWhenUnlockedThisDeviceOnly',
        storage: 'KeystoreAESGCM_NoAuth',
      },
    );

    const persistedKey = keychain.setGenericPassword.mock.calls[0][1];
    expect(manager.getStorageEncryptionConfigSync()).toEqual({
      encryptionKey: persistedKey,
      encryptionType: 'AES-256',
    });

    // Nothing on disk to migrate: no store is ever opened with a key...
    expect(
      mockMMKVState.createCalls.filter(call => call.encryptionKey),
    ).toHaveLength(0);

    // ...but every store is marked migrated so it is never recrypted later.
    const systemStore = getSystemStore();
    for (const id of manager.SECURED_STORAGE_IDS) {
      expect(systemStore?.data.get(markerFor(manager, id))).toBe(true);
    }
    expect(
      systemStore?.data.get(manager.STORAGE_ENCRYPTION_MIGRATION_DONE_FLAG),
    ).toBe(true);
  });

  it('reuses the existing keychain key and skips migration when already done', async () => {
    const { keychain, mmkv, manager } = setup();

    keychain.getGenericPassword.mockResolvedValue({ password: 'device-key' });
    mmkv
      .createMMKV({ id: 'system' })
      .set(manager.STORAGE_ENCRYPTION_MIGRATION_DONE_FLAG, true);

    await manager.initializeStorageEncryption();

    expect(manager.getStorageEncryptionConfigSync()).toEqual({
      encryptionKey: 'device-key',
      encryptionType: 'AES-256',
    });
    expect(keychain.setGenericPassword).not.toHaveBeenCalled();
    expect(
      mockMMKVState.createCalls.filter(call => call.encryptionKey),
    ).toHaveLength(0);
  });

  it('recrypts every legacy store to the new key on upgrade', async () => {
    const { keychain, manager } = setup();

    mockLegacyKey = 'legacy-env-key';
    for (const id of manager.SECURED_STORAGE_IDS) {
      mockMMKVState.existingIds.add(id);
    }

    await manager.initializeStorageEncryption();

    const newKey = keychain.setGenericPassword.mock.calls[0][1];

    for (const id of manager.SECURED_STORAGE_IDS) {
      // Opened with the legacy key and NO encryptionType (legacy stores were
      // created with the AES-128 default).
      const openCall = mockMMKVState.createCalls.find(call => call.id === id);
      expect(openCall).toEqual({ id, encryptionKey: 'legacy-env-key' });

      const store = mockMMKVState.stores.get(id);
      expect(store?.encrypt).toHaveBeenCalledWith(newKey, 'AES-256');

      expect(getSystemStore()?.data.get(markerFor(manager, id))).toBe(true);
    }
    expect(
      getSystemStore()?.data.get(
        manager.STORAGE_ENCRYPTION_MIGRATION_DONE_FLAG,
      ),
    ).toBe(true);
  });

  it('wipes only the store that fails to recrypt and continues with the rest', async () => {
    const { manager } = setup();

    mockLegacyKey = 'legacy-env-key';
    for (const id of manager.SECURED_STORAGE_IDS) {
      mockMMKVState.existingIds.add(id);
    }
    mockMMKVState.failingEncryptIds.add('session-storage');

    await manager.initializeStorageEncryption();

    expect(mockMMKVState.deletedIds).toEqual(['session-storage']);
    expect(mockLoggerError).toHaveBeenCalledWith(
      expect.stringContaining('session-storage'),
    );

    // Other stores were still recrypted, and the failed store is marked so
    // its (now wiped) replacement is never touched by migration again.
    for (const id of manager.SECURED_STORAGE_IDS) {
      if (id !== 'session-storage') {
        expect(mockMMKVState.stores.get(id)?.encrypt).toHaveBeenCalled();
      }
      expect(getSystemStore()?.data.get(markerFor(manager, id))).toBe(true);
    }
    expect(
      getSystemStore()?.data.get(
        manager.STORAGE_ENCRYPTION_MIGRATION_DONE_FLAG,
      ),
    ).toBe(true);
  });

  it('resumes an interrupted migration, skipping stores already migrated', async () => {
    const { keychain, mmkv, manager } = setup();

    // A previous launch persisted the key and migrated the first two stores,
    // then crashed before setting the done flag.
    keychain.getGenericPassword.mockResolvedValue({ password: 'device-key' });
    mockLegacyKey = 'legacy-env-key';

    const [migratedA, migratedB, ...remaining] = manager.SECURED_STORAGE_IDS;
    const systemStore = mmkv.createMMKV({ id: 'system' });
    systemStore.set(markerFor(manager, migratedA), true);
    systemStore.set(markerFor(manager, migratedB), true);

    for (const id of manager.SECURED_STORAGE_IDS) {
      mockMMKVState.existingIds.add(id);
    }

    await manager.initializeStorageEncryption();

    expect(keychain.setGenericPassword).not.toHaveBeenCalled();

    // Already-migrated stores must NOT be reopened with the legacy key:
    // MMKV would CRC-fail and silently wipe them.
    for (const id of [migratedA, migratedB]) {
      expect(
        mockMMKVState.createCalls.find(call => call.id === id),
      ).toBeUndefined();
    }
    for (const id of remaining) {
      expect(mockMMKVState.stores.get(id)?.encrypt).toHaveBeenCalledWith(
        'device-key',
        'AES-256',
      );
    }
    expect(
      getSystemStore()?.data.get(
        manager.STORAGE_ENCRYPTION_MIGRATION_DONE_FLAG,
      ),
    ).toBe(true);
  });

  it('shares a single initialization run between concurrent callers', async () => {
    const { keychain, manager } = setup();

    const first = manager.initializeStorageEncryption();
    const second = manager.initializeStorageEncryption();

    expect(second).toBe(first);
    await first;

    expect(keychain.getGenericPassword).toHaveBeenCalledTimes(1);
    expect(keychain.setGenericPassword).toHaveBeenCalledTimes(1);
  });

  it('retries the keychain read once before giving up', async () => {
    const { keychain, manager } = setup();

    keychain.getGenericPassword
      .mockRejectedValueOnce(new Error('transient keystore error'))
      .mockResolvedValueOnce({ password: 'device-key' });

    await manager.initializeStorageEncryption();

    expect(keychain.getGenericPassword).toHaveBeenCalledTimes(2);
    expect(keychain.setGenericPassword).not.toHaveBeenCalled();
    expect(manager.getStorageEncryptionConfigSync().encryptionKey).toBe(
      'device-key',
    );
  });

  it('falls back to the legacy key without setting markers when the keychain is unavailable', async () => {
    const { keychain, manager } = setup();

    mockLegacyKey = 'legacy-env-key';
    keychain.getGenericPassword.mockRejectedValue(new Error('keystore broken'));

    await expect(
      manager.initializeStorageEncryption(),
    ).resolves.toBeUndefined();

    // Legacy fallback: no encryptionType, replicating the exact legacy
    // MMKV configuration.
    const config = manager.getStorageEncryptionConfigSync();
    expect(config.encryptionKey).toBe('legacy-env-key');
    expect(config.encryptionType).toBeUndefined();

    expect(mockLoggerError).toHaveBeenCalledWith(
      expect.stringContaining('Keychain unavailable'),
    );

    // Markers untouched so the next launch retries the keychain + migration.
    expect(
      getSystemStore()?.data.get(
        manager.STORAGE_ENCRYPTION_MIGRATION_DONE_FLAG,
      ),
    ).toBeUndefined();
    expect(keychain.setGenericPassword).not.toHaveBeenCalled();
  });

  it('rejects when the keychain is unavailable and no legacy key exists, then allows a retry', async () => {
    const { keychain, manager } = setup();

    keychain.getGenericPassword.mockRejectedValue(new Error('keystore broken'));

    await expect(manager.initializeStorageEncryption()).rejects.toThrow(
      'keystore broken',
    );

    // The failed promise is discarded, so a later call retries and succeeds
    // once the keychain recovers.
    keychain.getGenericPassword.mockResolvedValue(false);

    await manager.initializeStorageEncryption();

    expect(manager.getStorageEncryptionConfigSync()).toEqual({
      encryptionKey: expect.stringMatching(/^[0-9a-f]{32}$/) as unknown,
      encryptionType: 'AES-256',
    });
  });

  it('reports an error when the config is read before initialization', () => {
    const { manager } = setup();

    // throwError logs in __DEV__ (which is true under jest) instead of
    // throwing.
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const config = manager.getStorageEncryptionConfigSync();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('has not been initialized'),
    );
    expect(config).toBeUndefined();
  });
});
