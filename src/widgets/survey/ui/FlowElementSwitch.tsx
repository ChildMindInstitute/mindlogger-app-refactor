import { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import { ScheduleEvent } from '@app/entities/event';
import {
  ActivityIdentityContext,
  ActivityStepper,
} from '@app/features/pass-survey';
import { colors } from '@app/shared/lib';
import { BackButton, CrossIcon, Box } from '@app/shared/ui';

import Finish from './Finish';
import Intermediate from './Intermediate';
import Summary from './Summary';
import { FlowPipelineItem } from '../model';

type Props = {
  onClose: () => void;
  onBack: () => void;
  onComplete: (reason: 'regular' | 'idle') => void;
  event: ScheduleEvent;
  isTimerElapsed: boolean;
  entityStartedAt: number;
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
}: Props) {
  const context = useMemo(
    () => ({
      ...payload,
    }),
    [payload],
  );

  const navigator = useNavigation();

  const closeAssessment = () => {
    navigator.goBack();
  };

  switch (type) {
    case 'Stepper': {
      return (
        <ActivityIdentityContext.Provider value={context}>
          <Box flex={1}>
            <BackButton
              accessibilityLabel="close-button"
              alignSelf="flex-end"
              mr={16}
              mt={10}
              mb={4}
            >
              <CrossIcon color={colors.tertiary} size={30} />
            </BackButton>

            <ActivityStepper
              idleTimer={event.timers.idleTimer}
              timer={event.timers.timer}
              entityStartedAt={entityStartedAt}
              onClose={closeAssessment}
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
          onClose={onBack}
          onFinish={() => onComplete('regular')}
        />
      );
    }

    case 'Summary': {
      return (
        <Box flex={1}>
          <BackButton alignSelf="flex-end" mr={16} mt={10} mb={4}>
            <CrossIcon color={colors.tertiary} size={30} />
          </BackButton>

          <Summary {...payload} onFinish={() => onComplete('regular')} />
        </Box>
      );
    }

    case 'Finish': {
      return (
        <Finish
          {...payload}
          isTimerElapsed={isTimerElapsed}
          onClose={onClose}
        />
      );
    }
  }
}

export default FlowElementSwitch;
