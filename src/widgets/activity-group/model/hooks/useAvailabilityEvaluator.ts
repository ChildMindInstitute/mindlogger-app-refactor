import { useQueryClient } from '@tanstack/react-query';

import { EventModel } from '@app/entities/event';
import { QueryDataUtils } from '@app/shared/api';

import { GroupUtility } from '../factories';

export function useAvailabilityEvaluator() {
  const queryClient = useQueryClient();

  function evaluateAvailableTo(appletId: string, eventId: string): Date | null {
    const queryDataUtils = new QueryDataUtils(queryClient);

    const availableToEvaluator = new EventModel.AvailableToEvaluator(
      GroupUtility,
    );

    const eventDto = queryDataUtils.getEventDto(appletId, eventId);

    if (!eventDto) {
      return null;
    }

    const event = EventModel.mapEventFromDto(eventDto);

    return availableToEvaluator.evaluate(event);
  }

  return { evaluateAvailableTo };
}
