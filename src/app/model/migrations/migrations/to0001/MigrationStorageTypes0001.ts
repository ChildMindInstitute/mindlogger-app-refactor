type FlowPipelineItemFrom = {
  type: 'Stepper' | 'Intermediate' | 'Summary' | 'Finish';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    flowId?: string;
    order: number;
  };
};

type FlowPipelineItemTo = {
  type: 'Stepper' | 'Intermediate' | 'Summary' | 'Finish';
  payload: {
    appletId: string;
    activityId: string;
    eventId: string;
    flowId?: string;
    order: number;
    activityName: string;
    activityDescription?: string;
    activityImage?: string | null;
  };
};

export type FlowStateFrom = {
  step: number;
  pipeline: FlowPipelineItemFrom[];
  isCompletedDueToTimer: boolean;
  context: Record<string, unknown>;
};

export type FlowStateTo = {
  step: number;
  flowName: string | null;
  scheduledDate: number | null;
  pipeline: FlowPipelineItemTo[];
  isCompletedDueToTimer: boolean;
  context: Record<string, unknown>;
};
