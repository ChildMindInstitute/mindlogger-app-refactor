import {
  AnalyticsService,
  Logger,
  MixEvents,
  MixProperties,
} from '@app/shared/lib';

export type LogActivityActionParams = {
  entityName: string;
  activityId: string;
  appletName: string;
  appletId: string;
};

export type LogFlowActionParams = {
  entityName: string;
  flowId: string;
  appletName: string;
  appletId: string;
};

export const logStartActivity = (params: LogActivityActionParams) => {
  Logger.log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" started, applet "${params.appletName}|${params.appletId}"`,
  );
  AnalyticsService.track(MixEvents.AssessmentStarted, {
    [MixProperties.AppletId]: params.appletId,
  });
};

export const logRestartActivity = (params: LogActivityActionParams) => {
  Logger.log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" restarted, applet "${params.appletName}|${params.appletId}"`,
  );
  AnalyticsService.track(MixEvents.ActivityRestart, {
    [MixProperties.AppletId]: params.appletId,
  });
  AnalyticsService.track(MixEvents.AssessmentStarted, {
    [MixProperties.AppletId]: params.appletId,
  });
};

export const logResumeActivity = (params: LogActivityActionParams) => {
  Logger.log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" resumed, applet "${params.appletName}|${params.appletId}"`,
  );
  AnalyticsService.track(MixEvents.ActivityResume, {
    [MixProperties.AppletId]: params.appletId,
  });
};

export const logStartFlow = (params: LogFlowActionParams) => {
  Logger.log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" started, applet "${params.appletName}|${params.appletId}"`,
  );
  AnalyticsService.track(MixEvents.AssessmentStarted, {
    [MixProperties.AppletId]: params.appletId,
  });
};

export const logRestartFlow = (params: LogFlowActionParams) => {
  Logger.log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" restarted, applet "${params.appletName}|${params.appletId}"`,
  );
  AnalyticsService.track(MixEvents.ActivityRestart, {
    [MixProperties.AppletId]: params.appletId,
  });
  AnalyticsService.track(MixEvents.AssessmentStarted, {
    [MixProperties.AppletId]: params.appletId,
  });
};

export const logResumeFlow = (params: LogFlowActionParams) => {
  Logger.log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" resumed, applet "${params.appletName}|${params.appletId}"`,
  );
  AnalyticsService.track(MixEvents.ActivityResume, {
    [MixProperties.AppletId]: params.appletId,
  });
};
