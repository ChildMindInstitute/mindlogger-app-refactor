import { AxiosResponse } from 'axios';

import { ImageUrl } from '@app/shared/lib/types/url';

import { ActivityDto } from './IActivityService';
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
  autoAssign: boolean;
  splashScreen: ImageUrl | null;
};

export type ActivityFlowRecordDto = {
  id: string;
  name: string;
  description: string;
  hideBadge: boolean;
  isSingleReport: boolean;
  order: number;
  autoAssign: boolean;
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

export type Integration = 'loris';

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

export type AppletDetailsRequest = {
  appletId: string;
};

export type AppletDetailsResponse = {
  result: AppletDetailsDto;
  respondentMeta: AppletRespondentMetaDto;
};

export type AppletAndActivitiesDetailsRequest = {
  appletId: string;
};

export type AppletAndActivitiesDetailsResponse = {
  result: {
    appletDetail: AppletDetailsDto;
    activitiesDetails: Array<ActivityDto>;
    respondentMeta: AppletRespondentMetaDto;
  };
};

export type AppletAssignmentsRequest = {
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

export type IAppletService = {
  getApplets: () => Promise<AxiosResponse<AppletsResponse>>;
  getAppletDetails: (
    request: AppletDetailsRequest,
  ) => Promise<AxiosResponse<AppletDetailsResponse>>;
  getAppletAndActivitiesDetails: (
    request: AppletAndActivitiesDetailsRequest,
  ) => Promise<AxiosResponse<AppletAndActivitiesDetailsResponse>>;
  getAppletAssignments: (
    request: AppletAssignmentsRequest,
  ) => Promise<AxiosResponse<AppletAssignmentsResponse>>;
};
