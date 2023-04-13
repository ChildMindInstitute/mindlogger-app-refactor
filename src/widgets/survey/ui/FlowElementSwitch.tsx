import { ScheduleEvent } from '@app/entities/event';
import {
  ActivityIdentityContext,
  ActivityStepper,
} from '@app/features/pass-survey';
import { colors } from '@app/shared/lib';
import { BackButton, Box, CrossIcon } from '@app/shared/ui';

import Finish from './Finish';
import Intermediate from './Intermediate';
import { FinishReason, FlowPipelineItem } from '../model';

type Props = {
  onClose: () => void;
  onBack: () => void;
  onComplete: () => void;
  event: ScheduleEvent;
  finishReason: FinishReason | null;
  entityStartedAt: number;
} & FlowPipelineItem;

function FlowElementSwitch({
  type,
  payload,
  event,
  onBack,
  onClose,
  onComplete,
  finishReason,
  entityStartedAt,
}: Props) {
  switch (type) {
    case 'Stepper': {
      return (
        <ActivityIdentityContext.Provider value={payload}>
          <Box flex={1}>
            <BackButton alignSelf="flex-end" mr={16} mt={10} mb={4}>
              <CrossIcon color={colors.tertiary} size={30} />
            </BackButton>

            <ActivityStepper
              {...payload}
              idleTimer={event.timers.idleTimer}
              timer={event.timers.timer}
              entityStartedAt={entityStartedAt}
              onClose={onClose}
              onFinish={onComplete}
            />
          </Box>
        </ActivityIdentityContext.Provider>
      );
    }

    case 'Intermediate': {
      return (
        <Intermediate {...payload} onClose={onBack} onFinish={onComplete} />
      );
    }

    case 'Finish': {
      return (
        <Finish {...payload} finishReason={finishReason!} onClose={onClose} />
      );
    }
  }
}

export default FlowElementSwitch;
