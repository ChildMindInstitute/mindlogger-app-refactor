import { QueryClient } from '@tanstack/react-query';

import {
  getDataFromQuery,
  getAppletDetailsKey,
  getAppletsKey,
  getEventsKey,
  getAppletBaseInfoKey,
} from '@app/shared/lib/utils/reactQueryHelpers';

import {
  AppletBaseInfoResponse,
  AppletDetailsDto,
  AppletDetailsResponse,
  AppletDto,
  AppletsResponse,
} from './IAppletService';
import { AppletEventsResponse, ScheduleEventDto } from './IEventsService';

export class QueryDataUtils {
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

  getBaseInfo(appletId: string): AppletBaseInfoResponse | null {
    return getDataFromQuery<AppletBaseInfoResponse>(
      getAppletBaseInfoKey(appletId),
      this.queryClient,
    );
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
