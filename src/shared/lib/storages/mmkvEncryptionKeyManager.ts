import * as Keychain from 'react-native-keychain';
import { createMMKV, deleteMMKV, existsMMKV } from 'react-native-mmkv';

import {
  LEGACY_STORE_ENCRYPTION_KEY,
  STORAGE_ENCRYPTION_KEYCHAIN_SERVICE,
  STORAGE_ENCRYPTION_KEYCHAIN_USERNAME,
  STORAGE_ENCRYPTION_TYPE,
  SYSTEM_STORAGE_ID,
} from '../constants';
import { throwError } from '../services/errorService';

// --- Migration-only constants -----------------------------------------------
// Everything in this block exists solely for the legacy-key recrypt migration
// and can be deleted together with recryptSecuredStorages() once
// LEGACY_STORE_ENCRYPTION_KEY is removed.

// Flags in the plain 'system' MMKV store tracking the recrypt migration
export const STORAGE_ENCRYPTION_MIGRATION_DONE_FLAG =
  'encryptionKeyMigrationDone';
export const STORAGE_ENCRYPTION_MIGRATION_MARKER_PREFIX =
  'encryptionKeyMigrated:';

/**
 * Every encrypted MMKV store that may exist on disk under the legacy
 * build-time key and must be recrypted with the per-device key.
 */
export const SECURED_STORAGE_IDS = [
  'navigation-storage',
  'session-storage',
  'upload_queue-storage',
  'activity_progress-storage',
  'user-info',
  'user-private-key',
  'mfa-token-storage',
  // Encrypted store created by the redux migration utilities, see
  // getMigrationStorageName in src/app/model/migrations/utils.ts
  // (MigrationPrefix + '--' + Storages.ActivityProgress).
  'migration----activity_progress-storage',
];
// ----------------------------------------------------------------------------

// Resolved lazily to avoid a require cycle: loggerInstance -> fileService ->
// systemRecordInstance -> storageInstanceManagerInstance ->
// StorageInstanceManager -> this module.
const getLogger = () =>
  (
    require('../services/loggerInstance') as typeof import('../services/loggerInstance')
  ).getDefaultLogger();

// Polyfilled by react-native-get-random-values (imported in index.js).
declare const crypto: {
  getRandomValues: <T extends Uint8Array>(array: T) => T;
};

export type StorageEncryptionConfig = {
  encryptionKey: string;
  /**
   * STORAGE_ENCRYPTION_TYPE for the per-device random key. Left undefined
   * in legacy fallback mode to replicate the exact MMKV configuration that
   * legacy stores were created with (AES-128 default).
   */
  encryptionType?: typeof STORAGE_ENCRYPTION_TYPE;
};

let cachedConfig: StorageEncryptionConfig | undefined;
let initPromise: Promise<void> | undefined;

function generateEncryptionKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  // 32-char hex string = 32-byte MMKV key, used with AES-256.
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function readKeyFromKeychain(): Promise<string | null> {
  const read = async () => {
    const result = await Keychain.getGenericPassword({
      service: STORAGE_ENCRYPTION_KEYCHAIN_SERVICE,
    });
    return result === false ? null : result.password;
  };

  try {
    return await read();
  } catch {
    // Single retry for transient keystore failures.
    return await read();
  }
}

async function saveKeyToKeychain(key: string): Promise<void> {
  const write = async () => {
    const result = await Keychain.setGenericPassword(
      STORAGE_ENCRYPTION_KEYCHAIN_USERNAME,
      key,
      {
        service: STORAGE_ENCRYPTION_KEYCHAIN_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
      },
    );
    if (result === false) {
      throw new Error(
        '[mmkvEncryptionKeyManager] Keychain rejected the encryption key',
      );
    }
  };

  try {
    await write();
  } catch {
    // Single retry for transient keystore failures.
    await write();
  }
}

/**
 * Re-encrypts all secured stores from the legacy build-time key to the
 * per-device key. Idempotent and crash-resumable: each processed store is
 * marked in the plain 'system' store. Markers are mandatory because MMKV
 * does not throw on a wrong key - it fails CRC checks and silently loads
 * the store as empty, so recrypting an already-migrated store again would
 * wipe it.
 */
function recryptSecuredStorages(newKey: string): void {
  // Direct createMMKV (instead of StorageInstanceManager) to avoid an
  // import cycle; MMKV caches native instances by id, so this is the same
  // underlying store.
  const systemStorage = createMMKV({ id: SYSTEM_STORAGE_ID });
  const legacyKey = LEGACY_STORE_ENCRYPTION_KEY;

  for (const id of SECURED_STORAGE_IDS) {
    const marker = `${STORAGE_ENCRYPTION_MIGRATION_MARKER_PREFIX}${id}`;
    if (systemStorage.getBoolean(marker)) {
      continue;
    }

    if (legacyKey && existsMMKV(id)) {
      try {
        // Legacy stores were created without encryptionType (AES-128
        // default), so the migration open must not pass one.
        const storage = createMMKV({ id, encryptionKey: legacyKey });
        storage.encrypt(newKey, STORAGE_ENCRYPTION_TYPE);
      } catch (error) {
        getLogger().error(
          `[mmkvEncryptionKeyManager] Failed to recrypt storage "${id}", wiping it: ${String(error)}`,
        );
        deleteMMKV(id);
      }
    }

    systemStorage.set(marker, true);
  }

  systemStorage.set(STORAGE_ENCRYPTION_MIGRATION_DONE_FLAG, true);
}

async function initialize(): Promise<void> {
  if (cachedConfig) {
    return;
  }

  // The catch must cover ONLY the keychain operations: falling back to the
  // legacy key because of a recrypt error would open already-recrypted
  // stores with the wrong key (CRC failure -> silent wipe).
  let resolvedKey: string;
  try {
    const existingKey = await readKeyFromKeychain();

    if (existingKey) {
      resolvedKey = existingKey;
    } else {
      resolvedKey = generateEncryptionKey();
      // Persist before recrypting: if the app crashes mid-migration, the
      // next launch can read the key back and resume where it left off.
      await saveKeyToKeychain(resolvedKey);
    }
  } catch (error) {
    getLogger().error(
      `[mmkvEncryptionKeyManager] Keychain unavailable, falling back to legacy key: ${String(error)}`,
    );

    if (!LEGACY_STORE_ENCRYPTION_KEY) {
      throw error;
    }

    // Hardware keystore unavailable (rare; mostly buggy Android keystore
    // implementations). Fall back to the legacy build-time key so the app
    // stays usable. Migration markers are intentionally NOT set, so the
    // next launch retries the keychain and migrates when it recovers.
    cachedConfig = { encryptionKey: LEGACY_STORE_ENCRYPTION_KEY };
    return;
  }

  const systemStorage = createMMKV({ id: SYSTEM_STORAGE_ID });
  if (!systemStorage.getBoolean(STORAGE_ENCRYPTION_MIGRATION_DONE_FLAG)) {
    // Covers both the first launch after an update and resuming a
    // migration interrupted by a crash on a previous launch.
    recryptSecuredStorages(resolvedKey);
  }

  cachedConfig = {
    encryptionKey: resolvedKey,
    encryptionType: STORAGE_ENCRYPTION_TYPE,
  };
}

/**
 * Resolves the per-device MMKV encryption key, generating and persisting it
 * to the iOS Keychain / Android Keystore on first launch, and migrating any
 * stores encrypted with the legacy build-time key.
 *
 * Must complete before any secured MMKV store is accessed. Safe to call
 * from multiple entry points (app boot, headless tasks) - concurrent calls
 * share a single initialization run.
 */
export function initializeStorageEncryption(): Promise<void> {
  if (!initPromise) {
    initPromise = initialize().catch((error: unknown) => {
      // Allow subsequent calls to retry.
      initPromise = undefined;
      throw error;
    });
  }
  return initPromise;
}

/**
 * Synchronous accessor for the resolved encryption config, for use by the
 * lazy storage getters. Requires initializeStorageEncryption() to have
 * completed.
 */
export function getStorageEncryptionConfigSync(): StorageEncryptionConfig {
  if (!cachedConfig) {
    throwError(
      '[mmkvEncryptionKeyManager] Storage encryption has not been initialized',
    );
  }
  return cachedConfig as StorageEncryptionConfig;
}
