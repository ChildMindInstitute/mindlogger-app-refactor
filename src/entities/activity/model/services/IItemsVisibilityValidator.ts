import { LookupEntityInput } from '@app/abstract/lib/types/entity';

export type IItemsVisibilityValidator = {
  hasActivityWithHiddenAllItems: (lookupInput: LookupEntityInput) => boolean;
};
