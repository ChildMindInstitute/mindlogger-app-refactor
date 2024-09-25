import {
  AnalyticsService,
  MixEvents,
  MixProperties,
} from '@app/shared/lib/analytics/AnalyticsService';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

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
  getDefaultLogger().log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" started, applet "${params.appletName}|${params.appletId}"`,
  );
  AnalyticsService.track(MixEvents.AssessmentStarted, {
    [MixProperties.AppletId]: params.appletId,
  });
};

export const logRestartActivity = (params: LogActivityActionParams) => {
  getDefaultLogger().log(
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
  getDefaultLogger().log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" resumed, applet "${params.appletName}|${params.appletId}"`,
  );
  AnalyticsService.track(MixEvents.ActivityResume, {
    [MixProperties.AppletId]: params.appletId,
  });
};

export const logStartFlow = (params: LogFlowActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" started, applet "${params.appletName}|${params.appletId}"`,
  );
  AnalyticsService.track(MixEvents.AssessmentStarted, {
    [MixProperties.AppletId]: params.appletId,
  });
};

export const logRestartFlow = (params: LogFlowActionParams) => {
  getDefaultLogger().log(
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
  getDefaultLogger().log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" resumed, applet "${params.appletName}|${params.appletId}"`,
  );
  AnalyticsService.track(MixEvents.ActivityResume, {
    [MixProperties.AppletId]: params.appletId,
  });
};
