export type Applet = {
  id: string;
  image?: string | null;
  displayName: string;
  description: string;
  numberOverdue?: number;
  themeId: string | null;
};

export type AppletTheme = {
  id: string;
  name: string;
  logo: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
};

export type AppletThemes = Record<string, AppletTheme | undefined>;

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
  image: string;
  watermark: string;
  themeId: number;
  activities: TActivity[];
  activityFlows: TActivityFlow[];
};
