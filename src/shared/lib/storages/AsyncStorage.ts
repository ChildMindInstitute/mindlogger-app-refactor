import { MMKV } from 'react-native-mmkv';

export class AsyncStorage {
  constructor(private storage: MMKV) {}

  getItem(key: string): Promise<string | null> {
    const value = this.storage.getString(key) ?? null;

    return Promise.resolve(value);
  }

  setItem(key: string, value: string): Promise<unknown> {
    // We have to remove item before setting a new value in MMKV
    // https://github.com/mrousavy/react-native-mmkv/issues/440
    this.storage.delete(key);
    this.storage.set(key, value);

    return Promise.resolve();
  }

  removeItem(key: string): Promise<void> {
    this.storage.delete(key);

    return Promise.resolve();
  }

  clearAll() {
    this.storage.clearAll();
  }
}
