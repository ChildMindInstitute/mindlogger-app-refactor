import {
  ImageUrl,
  callApiWithRetry,
  withDataExtraction,
} from '@app/shared/lib';

import { ActivityDto } from './activityService';
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

type Integration = 'loris';

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
  streamEnabled: boolean;
  streamIpAddress: string | null;
  streamPort: number | null;
  integrations: Integration[];
};

export type AppletRespondentMetaDto = {
  nickname?: string;
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

export type AppletDetailsResponse = {
  result: AppletDetailsDto;
  respondentMeta: AppletRespondentMetaDto;
};

type AppletAndActivitiesDetailsRequest = {
  appletId: string;
};

export type AppletAndActivitiesDetailsResponse = {
  result: {
    appletDetail: AppletDetailsDto;
    activitiesDetails: Array<ActivityDto>;
    respondentMeta: AppletRespondentMetaDto;
  };
};

type AppletAssignmentsRequest = {
  appletId: string;
};

export type AssignmentParticipantDto = {
  id: string;
  appletId: string;
  userId: string | null;
  secretUserId: string;
  firstName: string;
  lastName: string;
  nickname: string;
  tag: string;
  lastSeen: string | null;
};

export type AssignmentDto = {
  id: string;
  activityId: string | null;
  activityFlowId: string | null;
  respondentSubject: AssignmentParticipantDto;
  targetSubject: AssignmentParticipantDto;
};

export type AppletAssignmentsResponse = {
  result: {
    appletId: string;
    assignments: AssignmentDto[];
  };
};

function appletsService() {
  return {
    getApplets() {
      const apiCall = () =>
        httpService.get<AppletsResponse>('/applets', {
          params: { roles: 'respondent' },
        });
      return callApiWithRetry(withDataExtraction(apiCall));
    },
    getAppletDetails(request: AppletDetailsRequest) {
      const apiCall = () => {
        return httpService.get<AppletDetailsResponse>(
          `/applets/${request.appletId}`,
        );
      };
      return callApiWithRetry(withDataExtraction(apiCall));
    },
    getAppletAndActivitiesDetails(request: AppletAndActivitiesDetailsRequest) {
      const apiCall = () => {
        return httpService.get<AppletAndActivitiesDetailsResponse>(
          `/activities/applet/${request.appletId}`,
        );
      };
      return callApiWithRetry(withDataExtraction(apiCall));
    },
    getAppletAssignments(request: AppletAssignmentsRequest) {
      const apiCall = () => {
        return httpService.get<AppletAssignmentsResponse>(
          `/users/me/assignments/${request.appletId}`,
        );
      };
      return callApiWithRetry(withDataExtraction(apiCall));
    },
  };
}

export const AppletsService = appletsService();
