import { useRoute, useNavigation } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-native';

import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { useActivityStorageRecord } from '@app/features/pass-survey/lib/hooks/useActivityStorageRecord';
import { RequestHealthRecordDataItemStep } from '@app/features/pass-survey/lib/types/payload';
import { useActivityState } from '@app/features/pass-survey/model/hooks/useActivityState';

import { useActiveAssessmentLink } from './useActiveAssessmentLink';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

jest.mock(
  '@app/features/pass-survey/lib/hooks/useActivityStorageRecord',
  () => ({
    useActivityStorageRecord: jest.fn(),
  }),
);

jest.mock('@app/features/pass-survey/model/hooks/useActivityState', () => ({
  useActivityState: jest.fn(),
}));

jest.mock('@app/shared/lib/services/loggerInstance', () => ({
  getDefaultLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
  }),
}));

describe('useActiveAssessmentLink', () => {
  // Common test variables
  const mockAppletId = 'applet-123';
  const mockActivityId = 'activity-456';
  const mockActivityName = 'Activity';
  const mockEventId = 'event-789';
  const mockTargetSubjectId = 'subject-101';
  const mockOrder = 1;

  const mockSetParams = jest.fn();
  const mockSetSubStep = jest.fn();
  const mockSetItemCustomProperty = jest.fn();
  const mockGetCurrentActivityStorageRecord = jest.fn();

  // Setup for each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock navigation
    (useNavigation as jest.Mock).mockReturnValue({
      setParams: mockSetParams,
    });

    // Mock activity state
    (useActivityState as jest.Mock).mockReturnValue({
      setSubStep: mockSetSubStep,
      setItemCustomProperty: mockSetItemCustomProperty,
    });

    // Mock activity storage record
    (useActivityStorageRecord as jest.Mock).mockReturnValue({
      getCurrentActivityStorageRecord: mockGetCurrentActivityStorageRecord,
    });
  });

  test('should do nothing when not coming from active assessment link', () => {
    // Setup route params without fromActiveAssessmentLink flag
    (useRoute as jest.Mock).mockReturnValue({
      params: {},
    });

    // Render the hook with the ActivityIdentityContext
    renderHook(() => useActiveAssessmentLink(), {
      wrapper: ({ children }) => (
        <ActivityIdentityContext.Provider
          value={{
            appletId: mockAppletId,
            activityId: mockActivityId,
            activityName: mockActivityName,
            eventId: mockEventId,
            targetSubjectId: mockTargetSubjectId,
            order: mockOrder,
          }}
        >
          {children}
        </ActivityIdentityContext.Provider>
      ),
    });

    // Verify no actions were taken
    expect(mockSetParams).not.toHaveBeenCalled();
    expect(mockSetSubStep).not.toHaveBeenCalled();
    expect(mockSetItemCustomProperty).not.toHaveBeenCalled();
    expect(mockGetCurrentActivityStorageRecord).not.toHaveBeenCalled();
  });

  test('should handle deep link by resetting the flag', () => {
    // Setup route params with fromActiveAssessmentLink flag
    (useRoute as jest.Mock).mockReturnValue({
      params: { fromActiveAssessmentLink: true },
    });

    // Mock empty activity record (no EHR items)
    mockGetCurrentActivityStorageRecord.mockReturnValue({
      items: [],
      step: 0,
    });

    // Render the hook with the ActivityIdentityContext
    renderHook(() => useActiveAssessmentLink(), {
      wrapper: ({ children }) => (
        <ActivityIdentityContext.Provider
          value={{
            appletId: mockAppletId,
            activityId: mockActivityId,
            activityName: mockActivityName,
            eventId: mockEventId,
            targetSubjectId: mockTargetSubjectId,
            order: mockOrder,
          }}
        >
          {children}
        </ActivityIdentityContext.Provider>
      ),
    });

    // Verify the flag was reset
    expect(mockSetParams).toHaveBeenCalledWith({
      fromActiveAssessmentLink: false,
    });

    // But no EHR-specific actions were taken
    expect(mockSetSubStep).not.toHaveBeenCalled();
    expect(mockSetItemCustomProperty).not.toHaveBeenCalled();
  });

  test('should handle EHR item in OneUpHealth step when coming from deep link', () => {
    // Setup route params with fromActiveAssessmentLink flag
    (useRoute as jest.Mock).mockReturnValue({
      params: { fromActiveAssessmentLink: true },
    });

    // Mock activity record with EHR item at OneUpHealth step
    const ehrItemIndex = 2;
    mockGetCurrentActivityStorageRecord.mockReturnValue({
      items: [
        { type: 'Slider' },
        { type: 'Radio' },
        {
          type: 'RequestHealthRecordData',
          subStep: RequestHealthRecordDataItemStep.OneUpHealth,
        },
      ],
      step: ehrItemIndex, // Current step is the EHR item
    });

    // Render the hook with the ActivityIdentityContext
    renderHook(() => useActiveAssessmentLink(), {
      wrapper: ({ children }) => (
        <ActivityIdentityContext.Provider
          value={{
            appletId: mockAppletId,
            activityId: mockActivityId,
            activityName: mockActivityName,
            eventId: mockEventId,
            targetSubjectId: mockTargetSubjectId,
            order: mockOrder,
          }}
        >
          {children}
        </ActivityIdentityContext.Provider>
      ),
    });

    // Verify the flag was reset
    expect(mockSetParams).toHaveBeenCalledWith({
      fromActiveAssessmentLink: false,
    });

    // Verify EHR-specific actions were taken
    expect(mockSetSubStep).toHaveBeenCalledWith(
      ehrItemIndex,
      RequestHealthRecordDataItemStep.AdditionalPrompt,
    );
    expect(mockSetItemCustomProperty).toHaveBeenCalledWith(
      ehrItemIndex,
      'additionalEHRs',
      null,
    );
  });

  test('should not modify EHR item when not at OneUpHealth step', () => {
    // Setup route params with fromActiveAssessmentLink flag
    (useRoute as jest.Mock).mockReturnValue({
      params: { fromActiveAssessmentLink: true },
    });

    // Mock activity record with EHR item at a different step
    const ehrItemIndex = 1;
    mockGetCurrentActivityStorageRecord.mockReturnValue({
      items: [
        { type: 'Slider' },
        {
          type: 'RequestHealthRecordData',
          subStep: RequestHealthRecordDataItemStep.ConsentPrompt, // Not OneUpHealth
        },
      ],
      step: ehrItemIndex,
    });

    // Render the hook with the ActivityIdentityContext
    renderHook(() => useActiveAssessmentLink(), {
      wrapper: ({ children }) => (
        <ActivityIdentityContext.Provider
          value={{
            appletId: mockAppletId,
            activityId: mockActivityId,
            activityName: mockActivityName,
            eventId: mockEventId,
            targetSubjectId: mockTargetSubjectId,
            order: mockOrder,
          }}
        >
          {children}
        </ActivityIdentityContext.Provider>
      ),
    });

    // Verify the flag was reset
    expect(mockSetParams).toHaveBeenCalledWith({
      fromActiveAssessmentLink: false,
    });

    // But no EHR-specific actions were taken
    expect(mockSetSubStep).not.toHaveBeenCalled();
    expect(mockSetItemCustomProperty).not.toHaveBeenCalled();
  });

  test('should not modify EHR item when not currently on the EHR step', () => {
    // Setup route params with fromActiveAssessmentLink flag
    (useRoute as jest.Mock).mockReturnValue({
      params: { fromActiveAssessmentLink: true },
    });

    // Mock activity record with EHR item but we're on a different step
    mockGetCurrentActivityStorageRecord.mockReturnValue({
      items: [
        { type: 'Slider' },
        {
          type: 'RequestHealthRecordData',
          subStep: RequestHealthRecordDataItemStep.OneUpHealth,
        },
      ],
      step: 0, // Current step is NOT the EHR item
    });

    // Render the hook with the ActivityIdentityContext
    renderHook(() => useActiveAssessmentLink(), {
      wrapper: ({ children }) => (
        <ActivityIdentityContext.Provider
          value={{
            appletId: mockAppletId,
            activityId: mockActivityId,
            activityName: mockActivityName,
            eventId: mockEventId,
            targetSubjectId: mockTargetSubjectId,
            order: mockOrder,
          }}
        >
          {children}
        </ActivityIdentityContext.Provider>
      ),
    });

    // Verify the flag was reset
    expect(mockSetParams).toHaveBeenCalledWith({
      fromActiveAssessmentLink: false,
    });

    // But no EHR-specific actions were taken
    expect(mockSetSubStep).not.toHaveBeenCalled();
    expect(mockSetItemCustomProperty).not.toHaveBeenCalled();
  });

  test('should handle case when activity record is null', () => {
    // Setup route params with fromActiveAssessmentLink flag
    (useRoute as jest.Mock).mockReturnValue({
      params: { fromActiveAssessmentLink: true },
    });

    // Mock null activity record
    mockGetCurrentActivityStorageRecord.mockReturnValue(null);

    // Render the hook with the ActivityIdentityContext
    renderHook(() => useActiveAssessmentLink(), {
      wrapper: ({ children }) => (
        <ActivityIdentityContext.Provider
          value={{
            appletId: mockAppletId,
            activityId: mockActivityId,
            activityName: mockActivityName,
            eventId: mockEventId,
            targetSubjectId: mockTargetSubjectId,
            order: mockOrder,
          }}
        >
          {children}
        </ActivityIdentityContext.Provider>
      ),
    });

    // Verify the flag was reset
    expect(mockSetParams).toHaveBeenCalledWith({
      fromActiveAssessmentLink: false,
    });

    // But no EHR-specific actions were taken
    expect(mockSetSubStep).not.toHaveBeenCalled();
    expect(mockSetItemCustomProperty).not.toHaveBeenCalled();
  });
});
