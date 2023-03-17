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
export type FlowProgress = {
  type: ActivityPipelineType.Flow;
  currentActivityId: string;
};

export type ActivityProgress = {
  type: ActivityPipelineType.Regular;
};

export type EntityProgress = FlowProgress | ActivityProgress;

export type ProgressPayload = EntityProgress & {
  startAt: Date;
  endAt: Date | null;
};

type EntityEvents = Record<string, ProgressPayload>;
type AppletInProgressEntities = Record<string, EntityEvents>;

export type EntitiesInProgress = Record<string, AppletInProgressEntities>;
