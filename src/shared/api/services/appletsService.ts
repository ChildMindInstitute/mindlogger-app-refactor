import { Language } from '@app/shared/lib';

import httpService from './httpService';

export type ActivityRecordDto = {
  id: string;
  name: string;
  description: Record<Language, string>;
  image: string;
  isReviewable: boolean;
  isSkippable: boolean;
  ordering: boolean;
  splashScreen: string;
};

export type ActivityFlowRecordDto = {
  id: string;
  name: string;
  image: string;
  description: Record<Language, string>;
  hideBadge: boolean;
  isSingleReport: boolean;
  ordering: boolean;
  items: Array<{ activityId: string }>;
};

export type AppletDetailsDto = {
  id: string;
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
  timeFrom: { hours: number; minutes: number } | null;
  timeTo: { hours: number; minutes: number } | null;
  allowAccessBeforeFromTime: boolean;
  startDate?: string | null;
  endDate?: string | null;
  selectedDay?: string | null;
};

export type ScheduleEventDto = {
  activityId: number;
  availability: EventAvailabilityDto;
};

type AppletDto = {
  id: number;
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
  appletId: string;
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
