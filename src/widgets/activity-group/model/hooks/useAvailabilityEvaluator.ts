import { useQueryClient } from '@tanstack/react-query';

import { AvailableToEvaluator } from '@app/entities/event/model/AvailableToEvaluator';
import { mapEventFromDto } from '@app/entities/event/model/mappers';
import { QueryDataUtils } from '@app/shared/api/services/QueryDataUtils';

import { GroupUtility } from '../factories/GroupUtility';

export function useAvailabilityEvaluator() {
  const queryClient = useQueryClient();

  function evaluateAvailableTo(appletId: string, eventId: string): Date | null {
    const queryDataUtils = new QueryDataUtils(queryClient);

    const availableToEvaluator = new AvailableToEvaluator(GroupUtility);

    const eventDto = queryDataUtils.getEventDto(appletId, eventId);

    if (!eventDto) {
      return null;
    }

    const event = mapEventFromDto(eventDto);

    return availableToEvaluator.evaluate(event);
  }

  return { evaluateAvailableTo };
}
