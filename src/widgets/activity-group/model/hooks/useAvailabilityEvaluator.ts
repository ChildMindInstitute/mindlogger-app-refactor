import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { convertProgress } from '@app/abstract/lib';
import { AppletModel } from '@app/entities/applet';
import { EventModel } from '@app/entities/event';
import { QueryDataUtils } from '@app/shared/api';

import { GroupUtility } from '../factories';
import { mapActivitiesFromDto } from '../mappers';

export function useAvailabilityEvaluator() {
  const queryClient = useQueryClient();

  const storeProgress = useSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  function evaluateAvailableTo(appletId: string, eventId: string): Date | null {
    const queryDataUtils = new QueryDataUtils(queryClient);
    const appletDto = queryDataUtils.getAppletDto(appletId);
    const activities = mapActivitiesFromDto(appletDto!.activities);

    const availableToEvaluator = new EventModel.AvailableToEvaluator(
      new GroupUtility({
        allAppletActivities: activities,
        appletId: appletId,
        progress: convertProgress(storeProgress),
      }),
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
