import { MMKV } from 'react-native-mmkv';

class AsyncStorage {
  constructor(private storage: MMKV) {}

  getItem(key: string): Promise<string | null> {
    const value = this.storage.getString(key) ?? null;

    return Promise.resolve(value);
  }

  setItem(key: string, value: string): Promise<unknown> {
    this.storage.set(key, value);

    return Promise.resolve();
  }

  removeItem(key: string): Promise<void> {
    this.storage.delete(key);

    return Promise.resolve();
  }
}

export default AsyncStorage;
