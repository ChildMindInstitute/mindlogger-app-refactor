import { QueryClient } from '@tanstack/react-query';

import {
  getAppletDetailsKey,
  getAppletsKey,
  getDataFromQuery,
  getEventsKey,
} from '@app/shared/lib';

import {
  AppletDetailsDto,
  AppletDetailsResponse,
  AppletDto,
  AppletsResponse,
} from './appletsService';
import { AppletEventsResponse, ScheduleEventDto } from './eventsService';

class QueryDataUtils {
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  getAppletDto(appletId: string): AppletDetailsDto | null {
    const result = getDataFromQuery<AppletDetailsResponse>(
      getAppletDetailsKey(appletId),
      this.queryClient,
    );

    return result?.result ?? null;
  }

  getAppletListDto(): AppletDto[] | null {
    const result = getDataFromQuery<AppletsResponse>(
      getAppletsKey(),
      this.queryClient,
    );

    return result?.result ?? null;
  }

  getEventsDto(appletId: string): ScheduleEventDto[] | null {
    const eventsKey = getEventsKey(appletId);

    const response = getDataFromQuery<AppletEventsResponse>(
      eventsKey,
      this.queryClient,
    );

    return response?.result.events ?? null;
  }

  getEventDto(appletId: string, eventId: string): ScheduleEventDto | null {
    const eventsDto = this.getEventsDto(appletId);

    if (!eventsDto) {
      return null;
    }

    const eventDto = eventsDto.find(dto => dto.id === eventId);

    return eventDto ?? null;
  }
}

export default QueryDataUtils;
