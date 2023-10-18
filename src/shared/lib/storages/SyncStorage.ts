import { MMKV } from 'react-native-mmkv';

class SyncStorage {
  constructor(private storage: MMKV) {}

  getItem(key: string): string | null {
    const value = this.storage.getString(key) ?? null;

    return value;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clearAll(): void {
    this.storage.clearAll();
  }
}

export default SyncStorage;
