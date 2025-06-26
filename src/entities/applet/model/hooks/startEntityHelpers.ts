import { ResponseType } from '@app/shared/api/services/ActivityItemDto';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import {
  MixEvents,
  MixProperties,
  MixpanelFeature,
} from '@app/shared/lib/analytics/IAnalyticsService';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

export type LogActivityActionParams = {
  entityName: string;
  activityId: string;
  appletName: string;
  appletId: string;
  itemTypes: ResponseType[];
};

export type LogFlowActionParams = {
  entityName: string;
  flowId: string;
  appletName: string;
  appletId: string;
  itemTypes: ResponseType[];
};

/**
 * Helper function to build analytics properties with Feature and ItemTypes
 */
const getSurveyProps = ({
  appletId,
  activityId,
  flowId,
  itemTypes,
}: {
  appletId: string;
  activityId?: string;
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

export const logStartActivity = (params: LogActivityActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" started, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.AssessmentStarted,
    getSurveyProps(params),
  );
};

export const logRestartActivity = (params: LogActivityActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" restarted, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.ActivityRestart,
    getSurveyProps(params),
  );
  getDefaultAnalyticsService().track(
    MixEvents.AssessmentStarted,
    getSurveyProps(params),
  );
};

export const logResumeActivity = (params: LogActivityActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" resumed, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.ActivityResume,
    getSurveyProps(params),
  );
};

export const logStartFlow = (params: LogFlowActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" started, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.AssessmentStarted,
    getSurveyProps(params),
  );
};

export const logRestartFlow = (params: LogFlowActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" restarted, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.ActivityRestart,
    getSurveyProps(params),
  );
  getDefaultAnalyticsService().track(
    MixEvents.AssessmentStarted,
    getSurveyProps(params),
  );
};

export const logResumeFlow = (params: LogFlowActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" resumed, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.ActivityResume,
    getSurveyProps(params),
  );
};
