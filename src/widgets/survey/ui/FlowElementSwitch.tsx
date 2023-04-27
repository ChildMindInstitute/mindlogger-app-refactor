import { useMemo } from 'react';

import { ScheduleEvent } from '@app/entities/event';
import {
  ActivityIdentityContext,
  ActivityStepper,
} from '@app/features/pass-survey';
import { colors } from '@app/shared/lib';
import { BackButton, CrossIcon, Box } from '@app/shared/ui';

import Finish from './Finish';
import Intermediate from './Intermediate';
import { FlowPipelineItem } from '../model';

type Props = {
  onClose: () => void;
  onBack: () => void;
  onComplete: () => void;
  event: ScheduleEvent;
  isTimerElapsed: boolean;
  entityStartedAt: number;
  pipelineActivityOrder: number;
} & FlowPipelineItem;

function FlowElementSwitch({
  type,
  payload,
  event,
  onBack,
  onClose,
  onComplete,
  isTimerElapsed,
  entityStartedAt,
  pipelineActivityOrder,
}: Props) {
  const context = useMemo(
    () => ({
      ...payload,
      order: pipelineActivityOrder,
    }),
    [payload, pipelineActivityOrder],
  );

  switch (type) {
    case 'Stepper': {
      return (
        <ActivityIdentityContext.Provider value={context}>
          <Box flex={1}>
            <BackButton alignSelf="flex-end" mr={16} mt={10} mb={4}>
              <CrossIcon color={colors.tertiary} size={30} />
            </BackButton>

            <ActivityStepper
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
        <Intermediate
          {...payload}
          order={pipelineActivityOrder}
          onClose={onBack}
          onFinish={onComplete}
        />
      );
    }

    case 'Finish': {
      return (
        <Finish
          {...payload}
          isTimerElapsed={isTimerElapsed}
          order={pipelineActivityOrder}
          onClose={onClose}
        />
      );
    }
  }
}

export default FlowElementSwitch;
