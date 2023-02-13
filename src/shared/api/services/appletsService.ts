import {
  ActivityFlowId,
  ActivityId,
  AppletId,
  EntityId,
  HourMinute,
  Language,
} from '@app/shared/lib';

import httpService from './httpService';

export type ActivityRecordDto = {
  id: ActivityId;
  name: string;
  description: Record<Language, string>;
  image: string;
  isReviewable: boolean;
  isSkippable: boolean;
  ordering: boolean;
  splashScreen: string;
};

export type ActivityFlowRecordDto = {
  id: ActivityFlowId;
  name: string;
  image: string;
  description: Record<Language, string>;
  hideBadge: boolean;
  isSingleReport: boolean;
  ordering: boolean;
  items: Array<{ activityId: ActivityId }>;
};

export type AppletDetailsDto = {
  id: AppletId;
  name?: string;
  image: string;
  displayName: string;
  description: Record<Language, string>;
  activities: ActivityRecordDto[];
  activityFlows: ActivityFlowRecordDto[];
};

export type EventAvailabilityDto = {
  availabilityType: number;
  oneTimeCompletion: boolean;
  periodicityType: number;
  timeFrom: HourMinute | null;
  timeTo: HourMinute | null;
  allowAccessBeforeFromTime: boolean;
  startDate?: string | null;
  endDate?: string | null;
  selectedDate?: string | null;
};

export type ScheduleEventDto = {
  entityId: EntityId;
  availability: EventAvailabilityDto;
};

type AppletDto = {
  id: AppletId;
  image?: string;
  displayName: string;
  description: Record<Language, string>;
  numberOverdue?: number;

  theme?: {
    logo?: string;
    smallLogo?: string;
  } | null;
};

export type AppletsResponse = {
  result: AppletDto[];
};

type AppletDetailsRequest = {
  appletId: AppletId;
};

export type AppletDetailsResponse = {
  result: AppletDetailsDto;
};

function appletsService() {
  return {
    getApplets() {
      return httpService.get<AppletsResponse>('/applets');
    },
    getAppletDetails(request: AppletDetailsRequest) {
      return httpService.get<AppletDetailsResponse>(
        `/applets/${request.appletId}`,
      );
    },
  };
}

export default appletsService();
