import { renderHook } from '@testing-library/react-native';

import { selectUserId } from '@app/entities/identity/model/selectors';
import { useHasSession } from '@app/entities/session/model/hooks/useHasSession';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

import { useDefaultBanners } from './useDefaultBanners';
import { useRebrandBanner } from './useRebrandBanner';
import { dismissedBannersSelector } from '../../model/selectors';

// Mock dependencies
jest.mock('@app/entities/session/model/hooks/useHasSession');
jest.mock('@app/shared/lib/hooks/redux');
jest.mock('./useRebrandBanner');
jest.mock('../../model/selectors');

describe('useDefaultBanners', () => {
  // Setup mock values
  const mockUserId = 'test-user-123';
  const mockDismissedBanners = {
    'user-test-user-123': ['BrandUpdateBanner'],
    global: [],
  };

  // Setup mock functions
  const mockUseHasSession = useHasSession as jest.MockedFunction<
    typeof useHasSession
  >;
  const mockUseAppSelector = useAppSelector as jest.MockedFunction<
    typeof useAppSelector
  >;
  const mockUseRebrandBanner = useRebrandBanner as jest.MockedFunction<
    typeof useRebrandBanner
  >;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup default mock returns
    mockUseHasSession.mockReturnValue(false);
    mockUseAppSelector.mockImplementation(selector => {
      if (selector === selectUserId) return mockUserId;
      if (selector === dismissedBannersSelector) return mockDismissedBanners;
      return undefined;
    });
    mockUseRebrandBanner.mockImplementation(() => {});
  });

  test('should use global banner key when user has no session', () => {
    // Setup
    mockUseHasSession.mockReturnValue(false);

    // Execute
    renderHook(() => useDefaultBanners());

    // Verify
    expect(mockUseHasSession).toHaveBeenCalledTimes(1);
    expect(mockUseAppSelector).toHaveBeenCalledWith(selectUserId);
    expect(mockUseAppSelector).toHaveBeenCalledWith(dismissedBannersSelector);
    expect(mockUseRebrandBanner).toHaveBeenCalledWith(
      mockDismissedBanners,
      'global',
    );
  });

  test('should use user-specific banner key when user has session', () => {
    // Setup
    mockUseHasSession.mockReturnValue(true);

    // Execute
    renderHook(() => useDefaultBanners());

    // Verify
    expect(mockUseHasSession).toHaveBeenCalledTimes(1);
    expect(mockUseAppSelector).toHaveBeenCalledWith(selectUserId);
    expect(mockUseAppSelector).toHaveBeenCalledWith(dismissedBannersSelector);
    expect(mockUseRebrandBanner).toHaveBeenCalledWith(
      mockDismissedBanners,
      `user-${mockUserId}`,
    );
  });

  test('should update dismissedRef when dismissed banners change', () => {
    // Setup
    renderHook(() => useDefaultBanners());

    // Initial verification
    expect(mockUseRebrandBanner).toHaveBeenCalledWith(
      mockDismissedBanners,
      'global',
    );

    // Update dismissed banners
    const updatedDismissedBanners = {
      'user-test-user-123': ['BrandUpdateBanner'],
      global: ['BrandUpdateBanner'],
    };

    mockUseAppSelector.mockImplementation(selector => {
      if (selector === selectUserId) return mockUserId;
      if (selector === dismissedBannersSelector) return updatedDismissedBanners;
      return undefined;
    });

    // Re-render with updated values
    renderHook(() => useDefaultBanners());

    // Verify ref was updated (useRebrandBanner called with new values)
    expect(mockUseRebrandBanner).toHaveBeenCalledWith(
      updatedDismissedBanners,
      'global',
    );
  });

  test('should handle undefined userId', () => {
    // Setup
    mockUseHasSession.mockReturnValue(true);
    mockUseAppSelector.mockImplementation(selector => {
      if (selector === selectUserId) return undefined;
      if (selector === dismissedBannersSelector) return mockDismissedBanners;
      return undefined;
    });

    // Execute
    renderHook(() => useDefaultBanners());

    // Verify
    expect(mockUseRebrandBanner).toHaveBeenCalledWith(
      mockDismissedBanners,
      'user-undefined',
    );
  });

  test('should handle empty dismissed banners', () => {
    // Setup
    const emptyDismissedBanners = {};
    mockUseAppSelector.mockImplementation(selector => {
      if (selector === selectUserId) return mockUserId;
      if (selector === dismissedBannersSelector) return emptyDismissedBanners;
      return undefined;
    });

    // Execute
    renderHook(() => useDefaultBanners());

    // Verify
    expect(mockUseRebrandBanner).toHaveBeenCalledWith(
      emptyDismissedBanners,
      'global',
    );
  });
});
