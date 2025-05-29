import { renderHook } from '@testing-library/react-native';

import {
  RequestHealthRecordDataItemStep,
  RequestHealthRecordDataPipelineItem,
  SliderPipelineItem,
} from '@app/features/pass-survey/lib/types/payload';
import { EHRConsent } from '@app/shared/api/services/ActivityItemDto';

import { useSubSteps } from './useSubSteps';

const mockSetSubStep = jest.fn();

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
    ...props,
  });

  beforeEach(() => {
    jest.clearAllMocks();
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
      useSubSteps({ item: mockItem, setSubStep: mockSetSubStep }),
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
      useSubSteps({ item: mockItem, answer, setSubStep: mockSetSubStep }),
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
      useSubSteps({ item: mockItem, answer, setSubStep: mockSetSubStep }),
    );

    expect(result.current.subStep).toBe(
      RequestHealthRecordDataItemStep.OneUpHealth,
    );
    expect(result.current.hasNextSubStep).toBe(false);
    expect(result.current.hasPrevSubStep).toBe(true);
    expect(result.current.nextButtonText).toBe('activity_navigation:skip');
  });

  test('should handle AdditionalPrompt sub step with additional EHRs requested', () => {
    const mockItem: RequestHealthRecordDataPipelineItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.AdditionalPrompt,
      additionalEHRs: 'requested',
    });

    const answer = { answer: EHRConsent.OptIn };

    const { result } = renderHook(() =>
      useSubSteps({ item: mockItem, answer, setSubStep: mockSetSubStep }),
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
      useSubSteps({ item: mockItem, answer, setSubStep: mockSetSubStep }),
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
      useSubSteps({ item: mockItem, answer, setSubStep: mockSetSubStep }),
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
      useSubSteps({ item: mockItem, answer, setSubStep: mockSetSubStep }),
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
      useSubSteps({ item: mockItem, answer, setSubStep: mockSetSubStep }),
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
      useSubSteps({ item: mockItem, answer, setSubStep: mockSetSubStep }),
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
      useSubSteps({ item: mockItem, answer, setSubStep: mockSetSubStep }),
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
      useSubSteps({ item: mockItem, answer, setSubStep: mockSetSubStep }),
    );

    mockSetSubStep(RequestHealthRecordDataItemStep.OneUpHealth);

    expect(mockSetSubStep).toHaveBeenCalledWith(
      RequestHealthRecordDataItemStep.OneUpHealth,
    );
  });
});
