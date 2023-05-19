import { ImageUrl } from '@app/shared/lib';

import httpService from './httpService';
import { SuccessfulResponse } from '../types';

export type ActivityRecordDto = {
  id: string;
  name: string;
  description: string;
  image: ImageUrl | null;
  isReviewable: boolean;
  isSkippable: boolean;
  showAllAtOnce: boolean;
  isHidden: boolean;
  responseIsEditable: boolean;
  order: number;
  splashScreen: ImageUrl | null;
};

export type ActivityFlowRecordDto = {
  id: string;
  name: string;
  description: string;
  hideBadge: boolean;
  isSingleReport: boolean;
  order: number;
  isHidden: boolean;
  activityIds: Array<string>;
};

export type ThemeDto = {
  id: string;
  name: string;
  logo: ImageUrl;
  backgroundImage: ImageUrl;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
};

export type AppletEncryptionDTO = {
  accountId: string;
  base: string;
  prime: string;
  publicKey: string;
};

export type AppletDetailsDto = {
  id: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  image: ImageUrl | null;
  watermark: ImageUrl | null;
  theme: ThemeDto | null;
  activities: ActivityRecordDto[];
  activityFlows: ActivityFlowRecordDto[];
  encryption: AppletEncryptionDTO | null;
};

export type AppletDto = {
  id: string;
  image: ImageUrl | null;
  displayName: string;
  description: string;
  theme: ThemeDto | null;
  version: string;
  about: string;
  watermark: ImageUrl | null;
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

export const AppletsService = appletsService();
