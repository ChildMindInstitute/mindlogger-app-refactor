import { useEventsQuery } from '@app/entities/event/api/hooks/useEventsQuery';
import { mapEventFromDto } from '@app/entities/event/model/mappers';

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

  const { data: event } = useEventsQuery(appletId, {
    select: response => {
      const dto = response.data.result.events.find(x => x.id === eventId);
      return mapEventFromDto(dto!);
    },
  });

  const flowPipelineItem = pipeline[step];

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
      {...flowPipelineItem}
      event={event!}
      onClose={onClose}
      onBack={back}
      onComplete={complete}
    />
  );
}

export default FlowSurvey;
