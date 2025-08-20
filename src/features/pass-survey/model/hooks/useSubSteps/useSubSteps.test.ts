import { renderHook } from '@testing-library/react-native';

// Define mock context values that will be used throughout the tests
const mockContextValues = {
  appletId: 'test-applet-id',
  activityId: 'test-activity-id',
  flowId: 'test-flow-id',
  eventId: 'test-event-id',
  targetSubjectId: 'test-subject-id',
  order: 0,
};

// Mock ActivityIdentityContext
jest.mock(
  '@app/features/pass-survey/lib/contexts/ActivityIdentityContext',
  () => ({
    ActivityIdentityContext: {
      displayName: 'ActivityIdentityContext',
      Provider: ({ children }: { children: React.ReactNode }) => children,
    },
  }),
);

// Mock React's useContext
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useContext: jest.fn().mockImplementation(context => {
      if (context?.displayName === 'ActivityIdentityContext') {
        return mockContextValues;
      }
      return originalReact.useContext(context);
    }),
  };
});

// Mock useQueryClient
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn().mockReturnValue({
    // Add any queryClient methods you need to mock here
  }),
}));

// Mock useActivityState
jest.mock('../useActivityState', () => ({
  useActivityState: jest.fn().mockReturnValue({
    setItemCustomProperty: jest.fn(),
  }),
}));

// Mock QueryDataUtils
jest.mock('@app/shared/api/services/QueryDataUtils', () => ({
  QueryDataUtils: jest.fn().mockImplementation(() => ({
    getBaseInfo: jest.fn().mockReturnValue({
      // Mock the baseInfo object structure that getResponseTypesMap expects
      result: {
        activities: [
          {
            id: 'test-activity-id',
            containsResponseTypes: ['test-response-type'],
          },
        ],
        items: {},
      },
    }),
  })),
}));

// Mock analytics function
jest.mock('@app/widgets/survey/lib/surveyStateAnalytics', () => ({
  trackEHRProviderSearchSkipped: jest.fn(),
}));

import {
  RequestHealthRecordDataItemStep,
  RequestHealthRecordDataPipelineItem,
  SliderPipelineItem,
} from '@app/features/pass-survey/lib/types/payload';
import { EHRConsent } from '@app/shared/api/services/ActivityItemDto';
import { QueryDataUtils } from '@app/shared/api/services/QueryDataUtils';
import { trackEHRProviderSearchSkipped } from '@app/widgets/survey/lib/surveyStateAnalytics';

import { useSubSteps } from './useSubSteps';

const mockSetSubStep = jest.fn();
const mockSetItemCustomProperty = jest.fn();

describe('useSubSteps', () => {
  const createMockEhrItem = (
    props: Partial<RequestHealthRecordDataPipelineItem>,
  ): RequestHealthRecordDataPipelineItem => ({
    type: 'RequestHealthRecordData',
    question: 'Would you like to share your health data?',
    timer: 0,
    subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
    payload: {
      optInOutOptions: [
        {
          id: EHRConsent.OptIn,
          label: 'Yes, I agree to share my health data',
        },
        {
          id: EHRConsent.OptOut,
          label: 'No, I do not want to share my health data',
        },
      ],
    },
    additionalEHRs: null,
    ehrSearchSkipped: false,
    ehrShareSuccess: false,
    ...props,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset all mocks for each test
    (trackEHRProviderSearchSkipped as jest.Mock).mockClear();
    mockSetItemCustomProperty.mockClear();

    // Reset QueryDataUtils mock implementation for each test
    (QueryDataUtils as jest.Mock).mockImplementation(() => ({
      getBaseInfo: jest.fn().mockReturnValue({
        result: {
          activities: [
            {
              id: 'test-activity-id',
              containsResponseTypes: ['test-response-type'],
            },
          ],
          items: {},
        },
      }),
    }));

    // Reset useActivityState mock for each test
    jest.requireMock('../useActivityState').useActivityState.mockReturnValue({
      setItemCustomProperty: mockSetItemCustomProperty,
    });
  });

  test('should return null subStep for non-requestHealthRecordData items', () => {
    const mockItem: SliderPipelineItem = {
      type: 'Slider',
      question: 'Test question',
      timer: 0,
      payload: {
        leftTitle: 'Left',
        rightTitle: 'Right',
        minValue: 0,
        maxValue: 100,
        showTickMarks: true,
        showTickLabels: true,
        isContinuousSlider: true,
        leftImageUrl: '',
        rightImageUrl: '',
        alerts: [],
        scores: [],
      },
    };

    const { result } = renderHook(() =>
      useSubSteps({ item: mockItem, setSubStep: mockSetSubStep, itemStep: 0 }),
    );

    expect(result.current.subStep).toBeNull();
    expect(result.current.hasNextSubStep).toBe(false);
    expect(result.current.hasPrevSubStep).toBe(false);
    expect(result.current.nextButtonText).toBeUndefined();
  });

  test('should handle ConsentPrompt sub step', () => {
    const mockItem: RequestHealthRecordDataPipelineItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
      additionalEHRs: null,
    });

    const answer = { answer: EHRConsent.OptIn };

    const { result } = renderHook(() =>
      useSubSteps({
        item: mockItem,
        answer,
        setSubStep: mockSetSubStep,
        itemStep: 0,
      }),
    );

    expect(result.current.subStep).toBe(
      RequestHealthRecordDataItemStep.ConsentPrompt,
    );
    expect(result.current.hasNextSubStep).toBe(true);
    expect(result.current.hasPrevSubStep).toBe(false);
    expect(result.current.nextButtonText).toBeUndefined();
  });

  test('should handle OneUpHealth sub step without additional EHRs requested', () => {
    const mockItem: RequestHealthRecordDataPipelineItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
      additionalEHRs: null,
    });

    const answer = { answer: EHRConsent.OptIn };

    const { result } = renderHook(() =>
      useSubSteps({
        item: mockItem,
        answer,
        setSubStep: mockSetSubStep,
        itemStep: 0,
      }),
    );

    expect(result.current.subStep).toBe(
      RequestHealthRecordDataItemStep.OneUpHealth,
    );
    expect(result.current.hasNextSubStep).toBe(false);
    expect(result.current.hasPrevSubStep).toBe(true);
    expect(result.current.nextButtonText).toBe('activity_navigation:skip');

    // Test handleSubmitSubStep
    result.current.handleSubmitSubStep();

    // Verify that setItemCustomProperty was called with the right parameters
    expect(mockSetItemCustomProperty).toHaveBeenCalledWith(
      0,
      'ehrSearchSkipped',
      true,
    );

    // Verify that trackEHRProviderSearchSkipped was called with the right parameters
    expect(trackEHRProviderSearchSkipped).toHaveBeenCalledWith(
      expect.objectContaining({
        appletId: 'test-applet-id',
        activityId: 'test-activity-id',
        flowId: 'test-flow-id',
        itemTypes: expect.any(Object),
      }),
    );
  });

  test('should handle AdditionalPrompt sub step with additional EHRs requested', () => {
    const mockItem: RequestHealthRecordDataPipelineItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.AdditionalPrompt,
      additionalEHRs: 'requested',
    });

    const answer = { answer: EHRConsent.OptIn };

    const { result } = renderHook(() =>
      useSubSteps({
        item: mockItem,
        answer,
        setSubStep: mockSetSubStep,
        itemStep: 0,
      }),
    );

    expect(result.current.subStep).toBe(
      RequestHealthRecordDataItemStep.AdditionalPrompt,
    );
    expect(result.current.hasNextSubStep).toBe(true);
    expect(result.current.hasPrevSubStep).toBe(false);
    expect(result.current.nextButtonText).toBeUndefined();
  });

  test('should not have next or previous sub steps if user opted out', () => {
    const mockItem: RequestHealthRecordDataPipelineItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
      additionalEHRs: null,
    });

    const answer = { answer: EHRConsent.OptOut };

    const { result } = renderHook(() =>
      useSubSteps({
        item: mockItem,
        answer,
        setSubStep: mockSetSubStep,
        itemStep: 0,
      }),
    );

    expect(result.current.hasNextSubStep).toBe(false);
    expect(result.current.hasPrevSubStep).toBe(false);
  });

  test('should handle next sub step correctly', () => {
    const mockItem: RequestHealthRecordDataPipelineItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
      additionalEHRs: null,
    });

    const answer = { answer: EHRConsent.OptIn };

    const { result } = renderHook(() =>
      useSubSteps({
        item: mockItem,
        answer,
        setSubStep: mockSetSubStep,
        itemStep: 0,
      }),
    );

    result.current.handleNextSubStep();

    expect(mockSetSubStep).toHaveBeenCalledWith(
      RequestHealthRecordDataItemStep.ConsentPrompt + 1,
    );
  });

  test('should handle previous sub step correctly without additional EHRs requested', () => {
    const mockItem: RequestHealthRecordDataPipelineItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
      additionalEHRs: null,
    });

    const answer = { answer: EHRConsent.OptIn };

    const { result } = renderHook(() =>
      useSubSteps({
        item: mockItem,
        answer,
        setSubStep: mockSetSubStep,
        itemStep: 0,
      }),
    );

    result.current.handlePrevSubStep();

    expect(mockSetSubStep).toHaveBeenCalledWith(
      RequestHealthRecordDataItemStep.OneUpHealth - 1,
    );
  });

  test('should handle next sub step correctly with additional EHRs explicitly not requested', () => {
    const mockItem: RequestHealthRecordDataPipelineItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.AdditionalPrompt,
      additionalEHRs: 'done',
    });

    const answer = { answer: EHRConsent.OptIn };

    const { result } = renderHook(() =>
      useSubSteps({
        item: mockItem,
        answer,
        setSubStep: mockSetSubStep,
        itemStep: 0,
      }),
    );

    // When additionalEHRs is 'done', we should not have a next step
    expect(result.current.hasNextSubStep).toBe(false);

    result.current.handleNextSubStep();

    expect(mockSetSubStep).not.toHaveBeenCalled();
  });

  test('should handle additional EHRs request - navigating from AdditionalPrompt to OneUpHealth', () => {
    const mockItem: RequestHealthRecordDataPipelineItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.AdditionalPrompt,
      additionalEHRs: 'requested',
    });

    const answer = { answer: EHRConsent.OptIn };

    const { result } = renderHook(() =>
      useSubSteps({
        item: mockItem,
        answer,
        setSubStep: mockSetSubStep,
        itemStep: 0,
      }),
    );

    // When additionalEHRs is 'requested', we should have a next step from AdditionalPrompt
    expect(result.current.hasNextSubStep).toBe(true);

    result.current.handleNextSubStep();

    expect(mockSetSubStep).toHaveBeenCalledWith(
      RequestHealthRecordDataItemStep.OneUpHealth,
    );
  });

  test('should handle additional EHRs request - navigating from OneUpHealth to AdditionalPrompt', () => {
    const mockItem: RequestHealthRecordDataPipelineItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
      additionalEHRs: 'requested',
    });

    const answer = { answer: EHRConsent.OptIn };

    const { result } = renderHook(() =>
      useSubSteps({
        item: mockItem,
        answer,
        setSubStep: mockSetSubStep,
        itemStep: 0,
      }),
    );

    result.current.handlePrevSubStep();

    expect(mockSetSubStep).toHaveBeenCalledWith(
      RequestHealthRecordDataItemStep.AdditionalPrompt,
    );
  });

  test('should handle setting sub step directly', () => {
    const mockItem: RequestHealthRecordDataPipelineItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
      additionalEHRs: null,
    });

    const answer = { answer: EHRConsent.OptIn };

    renderHook(() =>
      useSubSteps({
        item: mockItem,
        answer,
        setSubStep: mockSetSubStep,
        itemStep: 0,
      }),
    );

    mockSetSubStep(RequestHealthRecordDataItemStep.OneUpHealth);

    expect(mockSetSubStep).toHaveBeenCalledWith(
      RequestHealthRecordDataItemStep.OneUpHealth,
    );
  });
});
