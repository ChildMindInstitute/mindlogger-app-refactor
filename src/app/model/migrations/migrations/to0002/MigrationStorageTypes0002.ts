type FlowPipelineItemFrom = {
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
  flowName: string;
};
