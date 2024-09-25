import { LookupEntityInput } from '@app/abstract/lib/types/entity';

export type IMediaLookupService = {
  hasMediaReferences: (lookupInput: LookupEntityInput) => boolean;
};
