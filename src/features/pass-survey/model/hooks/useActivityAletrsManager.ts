import {
  ActivityState,
  PipelineItemResponse,
  RadioPipelineItem,
} from '../../lib';

type Args = {
  activityState: ActivityState | undefined;
};

function useActivityAlertsManager({ activityState }: Args) {
  function updateAlerts(answer: PipelineItemResponse) {
    const step = activityState!.step;
    const currentPipelineItem = activityState!.items[step] as RadioPipelineItem;

    console.log('answer => ', answer);
    console.log('item => ', currentPipelineItem.payload.options);
  }

  return { updateAlerts };
}

// export const retrieveSingleSelectAlert = (
//   pipelineItem: PipelineItem,
//   answer: PipelineItemResponse,
// ) => {
//   const payload = pipelineItem.payload;
//   const optionValue = answer;
// };

export default useActivityAlertsManager;
