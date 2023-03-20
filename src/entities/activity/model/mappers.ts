import { ActivityDto } from '@app/shared/api';

import {
  ActivityDetails,
  ActivityItem,
  ActivityItemConfig,
  ActivityItemType,
} from '../lib';

export function mapToActivity(dto: ActivityDto): ActivityDetails {
  return {
    ...dto,
    items: dto.items.map(item => ({
      ...item,
      inputType: item.inputType as ActivityItemType,
      config: item.config as ActivityItemConfig,
    })) as ActivityItem[],
  };
}
