import { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ScheduleEvent } from '@app/entities/event/lib/types/event';
import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { ActivityStepper } from '@app/features/pass-survey/ui/ActivityStepper';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import {
  MixEvents,
  MixProperties,
} from '@app/shared/lib/analytics/IAnalyticsService';
import { palette } from '@app/shared/lib/constants/palette';
import { BackButton } from '@app/shared/ui/BackButton';
import { Box } from '@app/shared/ui/base';
import { CloseIcon } from '@app/shared/ui/icons';
import { FlowPipelineItem } from '@widgets/survey/model/IPipelineBuilder';

import { FinishItem } from './Finish';
import { Intermediate } from './Intermediate';
import { Summary } from './Summary';

type Props = {
  onClose: () => void;
  onBack: () => void;
  onComplete: (reason: 'regular' | 'idle') => void;
  event: ScheduleEvent;
  isTimerElapsed: boolean;
  interruptionStep: number | null;
  entityStartedAt: number;
  flowId?: string;
} & FlowPipelineItem;

export function FlowElementSwitch({
  type,
  payload,
  event,
  onBack,
  onClose,
  onComplete,
  isTimerElapsed,
  interruptionStep,
  entityStartedAt,
  flowId,
}: Props) {
  const { t } = useTranslation();
  const context = useMemo(
    () => ({
      ...payload,
    }),
    [payload],
  );

  const navigator = useNavigation();

  const closeAssessment = (reason: 'regular' | 'click-on-return') => {
    if (reason === 'click-on-return') {
      getDefaultAnalyticsService().track(MixEvents.ReturnToActivitiesPressed, {
        [MixProperties.AppletId]: context.appletId,
      });
    }
    navigator.goBack();
  };

  switch (type) {
    case 'Stepper': {
      return (
        <ActivityIdentityContext.Provider value={context}>
          <Box flex={1}>
            <ActivityStepper
              {...payload}
              idleTimer={event.timers.idleTimer}
              timer={event.timers.timer}
              entityStartedAt={entityStartedAt}
              onClose={closeAssessment}
              onFinish={onComplete}
              flowId={flowId}
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
          <BackButton
            aria-label="close-button"
            alignSelf="flex-end"
            mr={16}
            mt={10}
            mb={4}
            p={12}
          >
            <CloseIcon color={palette.on_surface} size={18} />
          </BackButton>

          <Summary {...payload} onFinish={() => onComplete('regular')} />
        </Box>
      );
    }

    case 'Finish': {
      return (
        <FinishItem
          {...payload}
          isTimerElapsed={isTimerElapsed}
          interruptionStep={interruptionStep}
          onClose={onClose}
        />
      );
    }
  }
}
