import {
  PipelineItem,
  RequestHealthRecordDataPipelineItem,
} from '@app/features/pass-survey/lib/types/payload';
import { ResponseType } from '@app/shared/api/services/ActivityItemDto';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import {
  EHRStatus,
  MixEvents,
  MixProperties,
  MixpanelFeature,
} from '@app/shared/lib/analytics/IAnalyticsService';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

export type TrackBaseParams = {
  appletId: string;
  activityId: string;
  itemTypes: ResponseType[];
};

export type TrackActivityActionParams = TrackBaseParams & {
  entityName: string;
  appletName: string;
};

export type TrackFlowActionParams = TrackActivityActionParams & {
  flowId: string;
};

export type TrackCompleteSurveyParams = TrackBaseParams & {
  flowId?: string;
  submitId: string;
  pipelineItems: PipelineItem[];
};

export type TrackEHREventParams = TrackBaseParams & {
  flowId?: string;
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

export const trackStartActivity = (params: TrackActivityActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" started, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.AssessmentStarted,
    getAnalyticsProps(params),
  );
};

export const trackRestartActivity = (params: TrackActivityActionParams) => {
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

export const trackResumeActivity = (params: TrackActivityActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startActivity]: Activity "${params.entityName}|${params.activityId}" resumed, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.ActivityResume,
    getAnalyticsProps(params),
  );
};

export const trackStartFlow = (params: TrackFlowActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" started, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.AssessmentStarted,
    getAnalyticsProps(params),
  );
};

export const trackRestartFlow = (params: TrackFlowActionParams) => {
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

export const trackResumeFlow = (params: TrackFlowActionParams) => {
  getDefaultLogger().log(
    `[useStartEntity.startFlow]: Flow "${params.entityName}|${params.flowId}" resumed, applet "${params.appletName}|${params.appletId}"`,
  );
  getDefaultAnalyticsService().track(
    MixEvents.ActivityResume,
    getAnalyticsProps(params),
  );
};

export const trackCompleteSurvey = (params: TrackCompleteSurveyParams) => {
  const event = {
    ...getAnalyticsProps(params),
    [MixProperties.SubmitId]: params.submitId,
  };

  const ehrItem = params.pipelineItems.find(
    item => item.type === 'RequestHealthRecordData',
  ) as RequestHealthRecordDataPipelineItem | undefined;

  if (ehrItem) {
    if (ehrItem.ehrShareSuccess) {
      event[MixProperties.EHRStatus] = EHRStatus.ParticipantConsented;
    } else if (ehrItem.ehrSearchSkipped) {
      event[MixProperties.EHRStatus] = EHRStatus.ParticipantSkipped;
    } else {
      event[MixProperties.EHRStatus] = EHRStatus.ParticipantDeclined;
    }
  }

  getDefaultAnalyticsService().track(MixEvents.AssessmentCompleted, event);
};

export const trackEHRProviderSearchSkipped = (params: TrackEHREventParams) => {
  getDefaultAnalyticsService().track(MixEvents.EHRProviderSearchSkipped, {
    ...getAnalyticsProps(params),
  });
};

export const trackEHRProviderSearch = (params: TrackEHREventParams) => {
  getDefaultAnalyticsService().track(MixEvents.EHRProviderSearch, {
    ...getAnalyticsProps(params),
  });
};

export const trackEHRProviderShareSuccess = (params: TrackEHREventParams) => {
  getDefaultAnalyticsService().track(MixEvents.EHRProviderShareSuccess, {
    ...getAnalyticsProps(params),
  });
};
