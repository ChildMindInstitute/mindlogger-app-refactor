import SurveyItem from './SurveyItem';
import { useFlowState } from '../model';

type Props = {
  appletId: string;
  eventId: string;
  flowId?: string;
  activityId: string;
  onClose: () => void;
};

function Survey({ appletId, activityId, eventId, onClose, flowId }: Props) {
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
    <SurveyItem
      {...currentPipelineItem}
      onClose={onClose}
      onBack={back}
      onComplete={complete}
    />
  );
}

export default Survey;
