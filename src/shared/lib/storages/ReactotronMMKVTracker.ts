import Config from 'react-native-config';
import { MMKV } from 'react-native-mmkv';
import type { ReactotronReactNative } from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';

/**
 * MMKV Storage Tracker for Reactotron
 *
 * Tracks all MMKV storage instances created in the application
 * and configures Reactotron to monitor them.
 *
 * Usage:
 * 1. Register each MMKV instance via registerStorage()
 * 2. Call configureMMKVTracking() with Reactotron instance
 */

class MMKVStorageTracker {
  private storages: Map<string, MMKV> = new Map();

  /**
   * Register an MMKV storage instance for tracking
   * @param id - Unique identifier for the storage
   * @param storage - MMKV instance
   */
  registerStorage(id: string, storage: MMKV): void {
    if (Config.ENV !== 'dev') {
      return; // Only track in dev environment
    }

    if (this.storages.has(id)) {
      console.warn(
        `[ReactotronMMKVTracker] Storage with id "${id}" already registered`,
      );
      return;
    }

    this.storages.set(id, storage);
    console.log(`[ReactotronMMKVTracker] Registered storage: ${id}`);
  }

  /**
   * Get all registered storage instances
   */
  getAllStorages(): Array<{ id: string; storage: MMKV }> {
    return Array.from(this.storages.entries()).map(([id, storage]) => ({
      id,
      storage,
    }));
  }

  /**
   * Configure Reactotron to track all registered MMKV instances
   * @param reactotron - Reactotron instance
   */
  configureReactotronTracking(reactotron: any): void {
    if (Config.ENV !== 'dev') {
      return;
    }

    const storages = this.getAllStorages();

    if (storages.length === 0) {
      console.warn('[ReactotronMMKVTracker] No storages registered for tracking');
      return;
    }

    // Add MMKV plugin for each registered storage
    storages.forEach(({ id, storage }) => {
      reactotron.use(
        mmkvPlugin<any>({
          storage,
          // Filter sensitive data from being logged
          ignore: [
            'STORE_ENCRYPTION_KEY',
            'accessToken',
            'refreshToken',
            'password',
            'secret',
          ],
        }),
      );
      console.log(`[ReactotronMMKVTracker] Configured tracking for: ${id}`);
    });
  }

  /**
   * Clear all registered storages (useful for testing)
   */
  clear(): void {
    this.storages.clear();
  }
}

// Singleton instance
const tracker = new MMKVStorageTracker();

/**
 * Register an MMKV storage instance for Reactotron tracking
 * @param id - Unique identifier for the storage
 * @param storage - MMKV instance
 */
export function registerMMKVStorage(id: string, storage: MMKV): void {
  tracker.registerStorage(id, storage);
}

/**
 * Configure Reactotron to track all registered MMKV instances
 * Called from reactotron.config.ts after all plugins are loaded
 * @param reactotron - Reactotron instance
 */
export function configureMMKVTracking(reactotron: any): void {
  tracker.configureReactotronTracking(reactotron);
}

/**
 * Get all registered MMKV storage instances (for debugging)
 */
export function getAllMMKVStorages(): Array<{ id: string; storage: MMKV }> {
  return tracker.getAllStorages();
}
