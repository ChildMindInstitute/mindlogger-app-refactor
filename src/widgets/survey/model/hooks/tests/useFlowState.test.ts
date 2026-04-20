import { renderHook } from '@testing-library/react-native';

import { FlowState } from '@app/widgets/survey/lib/useFlowStorageRecord';

import { useFlowState } from '../useFlowState';

const mockUseFlowStorageRecord = jest.fn();

jest.mock('@app/widgets/survey/lib/useFlowStorageRecord', () => ({
  ...jest.requireActual('@app/widgets/survey/lib/useFlowStorageRecord'),
  useFlowStorageRecord: (...args: any[]) => mockUseFlowStorageRecord(...args),
}));

describe('useFlowState - remainingActivityIds and orders', () => {
  const mockFlowState: FlowState = {
    step: 1,
    flowName: 'Test Flow',
    scheduledDate: null,
    pipeline: [
      {
        type: 'Stepper' as const,
        payload: {
          appletId: 'applet-1',
          activityId: 'activity-1',
          activityName: 'Activity 1',
          activityDescription: '',
          activityImage: null,
          eventId: 'event-1',
          targetSubjectId: null,
          order: 0,
        },
      },
      {
        type: 'Stepper' as const,
        payload: {
          appletId: 'applet-1',
          activityId: 'activity-2',
          activityName: 'Activity 2',
          activityDescription: '',
          activityImage: null,
          eventId: 'event-1',
          targetSubjectId: null,
          order: 1,
        },
      },
      {
        type: 'Stepper' as const,
        payload: {
          appletId: 'applet-1',
          activityId: 'activity-3',
          activityName: 'Activity 3',
          activityDescription: '',
          activityImage: null,
          eventId: 'event-1',
          targetSubjectId: null,
          order: 2,
        },
      },
    ],
    isCompletedDueToTimer: false,
    interruptionStep: null,
    context: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFlowStorageRecord.mockReturnValue({
      flowStorageRecord: mockFlowState,
    });
  });

  it('should return remaining activity IDs from current step', () => {
    const { result } = renderHook(() =>
      useFlowState({
        appletId: 'applet-1',
        eventId: 'event-1',
        flowId: 'flow-1',
        targetSubjectId: null,
      }),
    );

    expect(result.current.remainingActivityIds).toEqual([
      'activity-2',
      'activity-3',
    ]);
  });

  it('should return remaining activity orders from current step', () => {
    const { result } = renderHook(() =>
      useFlowState({
        appletId: 'applet-1',
        eventId: 'event-1',
        flowId: 'flow-1',
        targetSubjectId: null,
      }),
    );

    expect(result.current.remainingActivityOrders).toEqual([1, 2]);
  });

  it('should return empty arrays when step is null', () => {
    mockUseFlowStorageRecord.mockReturnValue({
      flowStorageRecord: {
        ...mockFlowState,
        step: null,
      },
    });

    const { result } = renderHook(() =>
      useFlowState({
        appletId: 'applet-1',
        eventId: 'event-1',
        flowId: 'flow-1',
        targetSubjectId: null,
      }),
    );

    expect(result.current.remainingActivityIds).toEqual([]);
    expect(result.current.remainingActivityOrders).toEqual([]);
  });

  it('should return empty arrays when pipeline is empty', () => {
    mockUseFlowStorageRecord.mockReturnValue({
      flowStorageRecord: {
        ...mockFlowState,
        pipeline: [],
      },
    });

    const { result } = renderHook(() =>
      useFlowState({
        appletId: 'applet-1',
        eventId: 'event-1',
        flowId: 'flow-1',
        targetSubjectId: null,
      }),
    );

    expect(result.current.remainingActivityIds).toEqual([]);
    expect(result.current.remainingActivityOrders).toEqual([]);
  });

  it('should return all activities when step is 0', () => {
    mockUseFlowStorageRecord.mockReturnValue({
      flowStorageRecord: {
        ...mockFlowState,
        step: 0,
      },
    });

    const { result } = renderHook(() =>
      useFlowState({
        appletId: 'applet-1',
        eventId: 'event-1',
        flowId: 'flow-1',
        targetSubjectId: null,
      }),
    );

    expect(result.current.remainingActivityIds).toEqual([
      'activity-1',
      'activity-2',
      'activity-3',
    ]);
    expect(result.current.remainingActivityOrders).toEqual([0, 1, 2]);
  });

  it('should filter out non-Stepper items from pipeline', () => {
    const stateWithSummary: FlowState = {
      ...mockFlowState,
      step: 0,
      pipeline: [
        {
          type: 'Stepper' as const,
          payload: {
            appletId: 'applet-1',
            activityId: 'activity-1',
            activityName: 'Activity 1',
            activityDescription: '',
            activityImage: null,
            eventId: 'event-1',
            targetSubjectId: null,
            order: 0,
          },
        },
        {
          type: 'Summary',
          payload: {
            appletId: 'applet-1',
            activityId: 'activity-1',
            activityName: 'Activity 1',
            eventId: 'event-1',
            targetSubjectId: null,
            order: 0,
          },
        },
        {
          type: 'Stepper' as const,
          payload: {
            appletId: 'applet-1',
            activityId: 'activity-2',
            activityName: 'Activity 2',
            activityDescription: '',
            activityImage: null,
            eventId: 'event-1',
            targetSubjectId: null,
            order: 1,
          },
        },
      ],
    };

    mockUseFlowStorageRecord.mockReturnValue({
      flowStorageRecord: stateWithSummary,
    });

    const { result } = renderHook(() =>
      useFlowState({
        appletId: 'applet-1',
        eventId: 'event-1',
        flowId: 'flow-1',
        targetSubjectId: null,
      }),
    );

    expect(result.current.remainingActivityIds).toEqual([
      'activity-1',
      'activity-2',
    ]);
    expect(result.current.remainingActivityOrders).toEqual([0, 1]);
  });
});
