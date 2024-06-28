import { Answer } from '@app/features/pass-survey';
import {
  AnalyticsResponseType,
  AppletEncryptionDTO,
  ResponseConfig,
} from '@shared/api';

type Integration = 'loris';

export type AppletTheme = {
  logo: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
};

export type Applet = {
  id: string;
  image: string | null;
  displayName: string;
  description: string;
  numberOverdue?: number;
  theme: AppletTheme | null;
};

export type Activity = {
  id: string;
  name: string;
  image: string | null;
  description: string;
};

export type ActivityFlow = {
  id: string;
  name: string;
  image: string | null;
  description: string;
  activityIds: string[];
};

export type AppletDetails = {
  id: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  image: string | null;
  watermark: string | null;
  theme: AppletTheme | null;
  activities: Activity[];
  activityFlows: ActivityFlow[];
  encryption: AppletEncryptionDTO | null;
  streamEnabled: boolean;
  streamIpAddress: string | null;
  streamPort: string | null;
  consentsCapabilityEnabled: boolean;
};

export type AnalyticsItemValue = {
  date: Date;
  value: number | null;
};

export type ResponseAnalyticsValue = Array<AnalyticsItemValue>;

export type ItemResponses = {
  name: string;
  type: AnalyticsResponseType;
  data: ResponseAnalyticsValue;
  responseConfig: ResponseConfig;
};

export type ActivityResponses = {
  id: string;
  name: string;
  description: string | null;
  responses: Array<ItemResponses>;
};

export type AppletAnalytics = {
  id: string;
  activitiesResponses: Array<ActivityResponses> | null;
};

export type CompletedEntity = {
  entityId: string;
  eventId: string;
  endAt: number;
};

export type AppletVersion = {
  appletId: string;
  version: string;
};

export type AnalyticsAnswer = {
  itemId: string;
  answer: Answer;
  type: AnalyticsResponseType;
  name: string;
  createdAt: string;
};
