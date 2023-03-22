import FlowElementSwitch from './FlowElementSwitch';
import { useFlowState } from '../model';

type Props = {
  appletId: string;
  eventId: string;
  flowId?: string;
  activityId: string;
  onClose: () => void;
};

function FlowSurvey({ appletId, activityId, eventId, onClose, flowId }: Props) {
  const { next, back, step, pipeline } = useFlowState({
    appletId,
    activityId,
    eventId,
    flowId,
  });

  const currentPipelineItem = pipeline[step];

  function complete() {
    const isLast = step === pipeline.length - 1;

    if (isLast) {
      onClose();
    } else {
      next();
    }
  }

  return (
    <FlowElementSwitch
      {...currentPipelineItem}
      onClose={onClose}
      onBack={back}
      onComplete={complete}
    />
  );
}

export default FlowSurvey;
