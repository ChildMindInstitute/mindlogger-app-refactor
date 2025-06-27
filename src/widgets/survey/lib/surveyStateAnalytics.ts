import { ResponseType } from '@app/shared/api/services/ActivityItemDto';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import {
  MixEvents,
  MixProperties,
  MixpanelFeature,
} from '@app/shared/lib/analytics/IAnalyticsService';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

export type LogBaseParams = {
  appletId: string;
  activityId: string;
  itemTypes: ResponseType[];
};

export type LogActivityActionParams = LogBaseParams & {
  entityName: string;
  appletName: string;
};

export type LogFlowActionParams = LogActivityActionParams & {
  flowId: string;
};

export type LogCompleteSurveyParams = LogBaseParams & {
  flowId?: string;
  submitId: string;
};

/**
 * Helper function to build analytics properties with Feature and ItemTypes
 */
const getAnalyticsProps = ({
  appletId,
  activityId,
  flowId,
  itemTypes,
}: {
  appletId: string;
  activityId: string;
  flowId?: string;
  itemTypes: ResponseType[];
}) => {
  const event: Record<string, unknown> = {
    [MixProperties.AppletId]: appletId,
  };

  if (activityId) {
    event[MixProperties.ActivityId] = activityId;
  }

  if (flowId) {
    event[MixProperties.ActivityFlowId] = flowId;
  }

  event[MixProperties.ItemTypes] = itemTypes;

  if (itemTypes.includes('requestHealthRecordData')) {
    event[MixProperties.Feature] = [MixpanelFeature.EHR];
  }

  return event;
};

export const trackStartActivity = (params: LogActivityActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" started, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.AssessmentStarted,
    getAnalyticsProps(params),
  );
};

export const trackRestartActivity = (params: LogActivityActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" restarted, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.ActivityRestart,
    getAnalyticsProps(params),
  );
  getDefaultAnalyticsService().track(
    MixEvents.AssessmentStarted,
    getAnalyticsProps(params),
  );
};

export const trackResumeActivity = (params: LogActivityActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" resumed, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.ActivityResume,
    getAnalyticsProps(params),
  );
};

export const trackStartFlow = (params: LogFlowActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" started, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.AssessmentStarted,
    getAnalyticsProps(params),
  );
};

export const trackRestartFlow = (params: LogFlowActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" restarted, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.ActivityRestart,
    getAnalyticsProps(params),
  );
  getDefaultAnalyticsService().track(
    MixEvents.AssessmentStarted,
    getAnalyticsProps(params),
  );
};

export const trackResumeFlow = (params: LogFlowActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" resumed, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.ActivityResume,
    getAnalyticsProps(params),
  );
};

export const trackCompleteSurvey = (params: LogCompleteSurveyParams) => {
  getDefaultAnalyticsService().track(MixEvents.AssessmentCompleted, {
    ...getAnalyticsProps(params),
    [MixProperties.SubmitId]: params.submitId,
  });
};
