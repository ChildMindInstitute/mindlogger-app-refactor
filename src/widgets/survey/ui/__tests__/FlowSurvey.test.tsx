import { useEffect } from 'react';

import { act, render } from '@testing-library/react-native';

import { useActivityTimer } from '@app/features/pass-survey/lib/contexts/ActivityTimerContext';

import { FlowSurvey } from '../FlowSurvey';

// Stands in for a screen inside the activity, e.g. Unity, that subscribes.
const mockTimeIsUpListener = jest.fn();
jest.mock('../FlowElementSwitch', () => ({
  FlowElementSwitch: () => {
    const { onTimeIsUp } = useActivityTimer();
    useEffect(() => onTimeIsUp(mockTimeIsUpListener), [onTimeIsUp]);
    return null;
  },
}));

jest.mock('../TimeIsUpModal', () => ({
  TimeIsUpModal: () => null,
}));

let mockFinishEventTimer: () => void = () => {};
jest.mock('../../model/hooks/useEventTimer', () => ({
  useEventTimer: ({ onFinish }: { onFinish: () => void }) => {
    mockFinishEventTimer = onFinish;
  },
}));

let mockFinishAvailabilityTimer: () => void = () => {};
jest.mock('../../model/hooks/useAvailabilityTimer', () => ({
  useAvailabilityTimer: ({ onFinish }: { onFinish: () => void }) => {
    mockFinishAvailabilityTimer = onFinish;
  },
}));

const mockCanBeCompletedByTimer = jest.fn(() => true);
jest.mock('../../model/hooks/useFlowStateActions', () => ({
  useFlowStateActions: () => ({
    next: jest.fn(),
    skipToStep: jest.fn(),
    back: jest.fn(),
    idleTimeoutNext: jest.fn(),
    completeByTimer: jest.fn(),
    clearFlowStorageRecord: jest.fn(),
    canBeCompletedByTimer: mockCanBeCompletedByTimer,
  }),
}));

jest.mock('../../model/hooks/useFlowState', () => ({
  useFlowState: () => ({
    step: 0,
    pipeline: [{ type: 'Stepper', payload: { activityName: 'Activity' } }],
    isTimerElapsed: false,
    interruptionStep: null,
  }),
}));

jest.mock('../../model/hooks/useFlowRecordInitialization', () => ({
  useFlowRecordInitialization: jest.fn(),
}));

jest.mock('../../model/hooks/useActivityRecordsInitialization', () => ({
  useActivityRecordsInitialization: jest.fn(),
}));

jest.mock('@app/entities/event/model/hooks/useEvent', () => ({
  useScheduledEvent: () => ({ timers: {} }),
}));

jest.mock('@app/entities/applet/model/hooks/useInProgressRecord', () => ({
  useInProgressRecord: () => ({
    startedAtTimestamp: 0,
    availableUntilTimestamp: 0,
  }),
}));

const renderFlowSurvey = () =>
  render(
    <FlowSurvey
      appletId="applet"
      entityId="activity"
      entityType="regular"
      eventId="event"
      targetSubjectId={null}
      onClose={jest.fn()}
    />,
  );

describe('FlowSurvey time is up (M2-10888)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanBeCompletedByTimer.mockReturnValue(true);
  });

  test('notifies subscribers when the schedule window ends', () => {
    renderFlowSurvey();

    act(() => mockFinishAvailabilityTimer());

    expect(mockTimeIsUpListener).toHaveBeenCalledTimes(1);
  });

  test("notifies subscribers when the activity's time limit runs out", () => {
    renderFlowSurvey();

    act(() => mockFinishEventTimer());

    expect(mockTimeIsUpListener).toHaveBeenCalledTimes(1);
  });

  test('does not notify subscribers when the activity cannot be completed by the timer', () => {
    mockCanBeCompletedByTimer.mockReturnValue(false);
    renderFlowSurvey();

    act(() => mockFinishAvailabilityTimer());

    expect(mockTimeIsUpListener).not.toHaveBeenCalled();
  });
});
