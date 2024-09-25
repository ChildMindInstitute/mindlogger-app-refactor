import { LookupEntityInput } from '@app/abstract/lib/types/entity';

import { ActivityDetails } from '../../lib/types/activity';

export type IEntityActivitiesCollector = {
  collect: (input: LookupEntityInput) => ActivityDetails[];
};
