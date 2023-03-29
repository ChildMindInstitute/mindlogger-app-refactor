import httpService from './httpService';
import { SuccessfulResponse } from '../types';

export type ActivityRecordDto = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  isReviewable: boolean;
  isSkippable: boolean;
  showAllAtOnce: boolean;
  responseIsEditable: boolean;
  ordering: number;
  splashScreen: string | null;
};

export type ActivityFlowRecordDto = {
  id: string;
  name: string;
  description: string;
  hideBadge: boolean;
  isSingleReport: boolean;
  ordering: number;
  activityIds: Array<string>;
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

export type AppletDto = {
  id: string;
  image: string | null;
  displayName: string;
  description: string;
  theme: ThemeDto | null;
  version: string;
  about: string;
  watermark: string | null;
};

export type AppletsResponse = SuccessfulResponse<AppletDto[]>;

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
