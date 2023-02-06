import { createStorage } from './createStorage';

const storage = createStorage('async-storage');

const AsyncStorage = {
  getItem: (key: string): Promise<string | null> => {
    const value = storage.getString(key) ?? null;

    return Promise.resolve(value);
  },
  setItem: (key: string, value: string): Promise<unknown> => {
    storage.set(key, value);

    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    storage.delete(key);

    return Promise.resolve();
  },
};

export default AsyncStorage;
