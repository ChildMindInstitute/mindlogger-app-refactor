import { HourMinute } from '@app/shared/lib';

import httpService from './httpService';
import { SuccessfulResponse } from '../types';

export type ActivityRecordDto = {
  id: string;
  name: string;
  description: string;
  image: string;
  isReviewable: boolean;
  isSkippable: boolean;
  ordering: number;
  splashScreen: string;
};

export type ActivityFlowRecordDto = {
  id: string;
  name: string;
  description: string;
  hideBadge: boolean;
  isSingleReport: boolean;
  ordering: number;
  activityIds: string[];
};

export type ThemeDto = {
  id: string;
  name: string;
  logo: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
};

export type AppletDetailsDto = {
  id: string;
  name: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  image: string | null;
  watermark: string | null;
  theme: ThemeDto | null;
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
  entityId: string;
  availability: EventAvailabilityDto;
};

export type AppletDto = {
  id: string;
  image: string | null;
  displayName: string;
  description: string;
  numberOverdue?: number;
  theme: ThemeDto | null;
};

export type AppletsResponse = {
  result: AppletDto[];
};

type AppletDetailsRequest = {
  appletId: string;
};

export type AppletDetailsResponse = SuccessfulResponse<AppletDetailsDto>;

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
