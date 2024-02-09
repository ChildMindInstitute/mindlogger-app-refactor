import { MMKV } from 'react-native-mmkv';

class SyncStorage {
  constructor(private storage: MMKV) {}

  get __originalStorage__() {
    return this.storage;
  }

  getItem(key: string): string | null {
    const value = this.storage.getString(key) ?? null;

    return value;
  }

  setItem(key: string, value: string): void {
    // We have to remove item before setting a new value in MMKV
    // https://github.com/mrousavy/react-native-mmkv/issues/440
    this.storage.delete(key);
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
