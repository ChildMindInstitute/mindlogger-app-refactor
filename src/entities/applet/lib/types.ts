import { AppletEncryptionDTO } from '@shared/api';

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
};
