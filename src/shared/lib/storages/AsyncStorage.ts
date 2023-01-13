import Storage from './Storage';

const AsyncStorage = {
  getItem: (key: string): Promise<string | null> => {
    const value = Storage.getString(key) ?? null;

    return Promise.resolve(value);
  },
  setItem: (key: string, value: string): Promise<unknown> => {
    Storage.set(key, value);

    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    Storage.delete(key);

    return Promise.resolve();
  },
};

export default AsyncStorage;
