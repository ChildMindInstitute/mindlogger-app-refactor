import { EntityPath, EntityPathParams } from '@app/abstract/lib/types/entity';

export type CollectCompletionOutput = {
  appletId: string;
  activityId: string;
  flowId: string | undefined;
  eventId: string;
  targetSubjectId: string | null;
  order: number;
  activityName: string;
  completionType: 'intermediate' | 'finish';
  logAvailableTo?: string;
};

export interface ICollectCompletionsService {
  collectForEntity(path: EntityPath): CollectCompletionOutput[];

  collectAll(exclude?: EntityPathParams): CollectCompletionOutput[];

  hasExpiredEntity(): boolean;
}
