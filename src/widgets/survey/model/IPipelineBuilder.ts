import { FlowProgressActivity } from '@app/abstract/lib/types/entity.ts';

type FlowPipelineType = 'Stepper' | 'Intermediate' | 'Summary' | 'Finish';

type FlowPipelineItemBase = {
  type: FlowPipelineType;
};

export type HasSummary = (activityId: string) => boolean;

export interface StepperPipelineItem extends FlowPipelineItemBase {
  type: 'Stepper';
  payload: {
    appletId: string;
    activityId: string;
    activityName: string;
    activityDescription: string;
    activityImage: string | null;
    eventId: string;
    flowId?: string;
    targetSubjectId: string | null;
    order: number;
  };
}

interface IntermediatePipelineItem extends FlowPipelineItemBase {
  type: 'Intermediate';
  payload: {
    appletId: string;
    activityId: string;
    activityName: string;
    eventId: string;
    flowId: string;
    targetSubjectId: string | null;
    order: number;
  };
}

export type FinishReason = 'time-is-up' | 'regular';

interface SummaryPipelineItem extends FlowPipelineItemBase {
  type: 'Summary';
  payload: {
    appletId: string;
    activityId: string;
    activityName: string;
    eventId: string;
    flowId?: string;
    targetSubjectId: string | null;
    order: number;
  };
}

export interface FinishPipelineItem extends FlowPipelineItemBase {
  type: 'Finish';
  payload: {
    appletId: string;
    activityId: string;
    activityName: string;
    eventId: string;
    flowId?: string;
    targetSubjectId: string | null;
    order: number;
  };
}

export type FlowPipelineItem =
  | StepperPipelineItem
  | IntermediatePipelineItem
  | SummaryPipelineItem
  | FinishPipelineItem;

export type BuildPipelineArgs = {
  appletId: string;
  eventId: string;
  activities: FlowProgressActivity[];
  flowId: string;
  targetSubjectId: string | null;
  startFrom: number;
  hasSummary: HasSummary;
};
