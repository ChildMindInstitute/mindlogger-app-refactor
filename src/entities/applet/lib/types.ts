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
  description: string;
};

export type ActivityFlow = {
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

export const enum ActivityPipelineType {
  NotDefined = 0,
  Regular,
  Flow,
}
export type ActivityFlowProgress = {
  type: ActivityPipelineType.Flow;
  currentActivityId: string;
};

export type ActivityProgress = {
  type: ActivityPipelineType.Regular;
};

export type ActivityOrFlowProgress = ActivityFlowProgress | ActivityProgress;

export type ProgressPayload = ActivityOrFlowProgress & {
  startAt: Date;
  endAt: Date | null;
};

export type EntitiesInProgress = {
  [appletId in string]: {
    [entityId in string]: {
      [eventId in string]: ProgressPayload;
    };
  };
};
