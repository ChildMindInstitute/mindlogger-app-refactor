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

type Activity = {
  id: string;
  name: string;
  description: string;
};

type ActivityFlow = {
  id: string;
  name: string;
  description: string;
  activityIds: string[];
};

export type AppletDetails<
  TActivity extends Activity = Activity,
  TActivityFlow extends ActivityFlow = ActivityFlow,
> = {
  id: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  image: string | null;
  watermark: string | null;
  theme: AppletTheme | null;
  activities: TActivity[];
  activityFlows: TActivityFlow[];
};
