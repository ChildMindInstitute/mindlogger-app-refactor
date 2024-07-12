import { Item } from './types';

export const findById = (items: Item[], id: string): Item | undefined => {
  return items.find(val => val.id === id);
};
