import { useEffect } from 'react';

import { act, render } from '@testing-library/react-native';

import { useActivityTimer } from '@app/features/pass-survey/lib/contexts/ActivityTimerContext';

import { FlowSurvey } from '../FlowSurvey';

// Stands in for a screen inside the activity, e.g. Unity, that subscribes.
const mockTimeIsUpListener = jest.fn();
let mockSetWaiting: (isWaiting: boolean) => void = () => {};
jest.mock('../FlowElementSwitch', () => ({
  FlowElementSwitch: () => {
    const { onTimeIsUp, setWaiting } = useActivityTimer();
    mockSetWaiting = setWaiting;
    useEffect(() => onTimeIsUp(mockTimeIsUpListener), [onTimeIsUp]);
    return null;
  },
}));

type TimeIsUpModalProps = {
  onSubmit: () => void;
  onShow?: () => void;
  isLoading?: boolean;
};
let mockTimeIsUpModalProps: TimeIsUpModalProps | undefined;
jest.mock('../TimeIsUpModal', () => ({
  TimeIsUpModal: (props: TimeIsUpModalProps) => {
    mockTimeIsUpModalProps = props;
    return null;
  },
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
const mockCompleteByTimer = jest.fn();
jest.mock('../../model/hooks/useFlowStateActions', () => ({
  useFlowStateActions: () => ({
    next: jest.fn(),
    skipToStep: jest.fn(),
    back: jest.fn(),
    idleTimeoutNext: jest.fn(),
    completeByTimer: mockCompleteByTimer,
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
    mockTimeIsUpModalProps = undefined;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('notifies subscribers once the popup is showing after the schedule window ends', () => {
    renderFlowSurvey();

    act(() => mockFinishAvailabilityTimer());
    // Not before the popup is on screen.
    expect(mockTimeIsUpListener).not.toHaveBeenCalled();

    act(() => mockTimeIsUpModalProps?.onShow?.());

    expect(mockTimeIsUpListener).toHaveBeenCalledTimes(1);
  });

  test("notifies subscribers once the popup is showing after the activity's time limit runs out", () => {
    renderFlowSurvey();

    act(() => mockFinishEventTimer());
    act(() => mockTimeIsUpModalProps?.onShow?.());

    expect(mockTimeIsUpListener).toHaveBeenCalledTimes(1);
  });

  test('does not notify subscribers when the activity cannot be completed by the timer', () => {
    mockCanBeCompletedByTimer.mockReturnValue(false);
    renderFlowSurvey();

    act(() => mockFinishAvailabilityTimer());

    // The popup never shows, so nobody is told.
    expect(mockTimeIsUpModalProps).toBeUndefined();
    expect(mockTimeIsUpListener).not.toHaveBeenCalled();
  });

  test('OK submits right away when nothing is still saving', () => {
    renderFlowSurvey();
    act(() => mockFinishAvailabilityTimer());

    act(() => mockTimeIsUpModalProps?.onSubmit());

    expect(mockCompleteByTimer).toHaveBeenCalledWith('availability');
  });

  test('OK waits while a screen is still saving, then submits', () => {
    renderFlowSurvey();
    act(() => mockFinishAvailabilityTimer());
    act(() => mockSetWaiting(true));

    act(() => mockTimeIsUpModalProps?.onSubmit());

    // Still saving: the OK button spins and nothing is submitted yet.
    expect(mockTimeIsUpModalProps?.isLoading).toBe(true);
    expect(mockCompleteByTimer).not.toHaveBeenCalled();

    act(() => mockSetWaiting(false));

    expect(mockCompleteByTimer).toHaveBeenCalledWith('availability');
  });
});
