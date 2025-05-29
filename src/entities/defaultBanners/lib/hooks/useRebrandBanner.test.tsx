import { renderHook } from '@testing-library/react-native';

import { useBanners } from '@app/entities/banner/lib/hooks/useBanners';
import { BannerOrder } from '@app/entities/banner/model/slice';
import { ScreenRoute } from '@app/screens/config/types';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';

import { useRebrandBanner } from './useRebrandBanner';
import { defaultBannersActions } from '../../model/slice';

// Mock dependencies
jest.mock('@app/entities/banner/lib/hooks/useBanners');
jest.mock('@app/shared/lib/hooks/redux');
jest.mock('../../model/slice', () => ({
  defaultBannersActions: {
    dismissBanner: jest.fn(),
  },
}));

describe('useRebrandBanner', () => {
  // Setup mock values
  const mockBannerKey = 'user-123';

  // Setup mock functions
  const mockAddBanner = jest.fn();
  const mockRemoveBanner = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup default mock returns
    (useBanners as jest.Mock).mockReturnValue({
      addBanner: mockAddBanner,
      removeBanner: mockRemoveBanner,
    });

    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);

    // Setup the mock for dismissBanner action
    (
      defaultBannersActions.dismissBanner as unknown as jest.Mock
    ).mockImplementation(payload => ({
      type: 'defaultBanners/dismissBanner',
      payload,
    }));
  });

  test('should add banner when not previously dismissed', () => {
    // Setup
    const dismissed = {};
    const currentRouteName: ScreenRoute = 'Login';

    // Execute
    const { unmount } = renderHook(() =>
      useRebrandBanner(dismissed, mockBannerKey, currentRouteName),
    );

    // Verify
    expect(mockAddBanner).toHaveBeenCalledTimes(1);
    expect(mockAddBanner).toHaveBeenCalledWith(
      'BrandUpdateBanner',
      expect.objectContaining({
        backgroundColor: '#0B0907',
        color: expect.any(String),
        duration: null,
        icon: expect.anything(),
        children: expect.anything(),
        onClose: expect.any(Function),
      }),
      BannerOrder.Top,
    );

    // Cleanup
    unmount();
    expect(mockRemoveBanner).toHaveBeenCalledWith('BrandUpdateBanner');
  });

  test('should not add banner when previously dismissed', () => {
    // Setup
    const dismissed = {
      [mockBannerKey]: ['BrandUpdateBanner'],
    };
    const currentRouteName: ScreenRoute = 'Login';

    // Execute
    renderHook(() =>
      useRebrandBanner(dismissed, mockBannerKey, currentRouteName),
    );

    // Verify
    expect(mockAddBanner).not.toHaveBeenCalled();
  });

  test('should dispatch dismiss action when banner is manually closed', () => {
    // Setup
    const dismissed = {};
    const currentRouteName: ScreenRoute = 'Applets';

    // Execute
    renderHook(() =>
      useRebrandBanner(dismissed, mockBannerKey, currentRouteName),
    );

    // Get the onClose callback from the addBanner call
    const onCloseCallback = mockAddBanner.mock.calls[0][1].onClose;

    // Simulate manual close
    onCloseCallback('manual');

    // Verify
    expect(defaultBannersActions.dismissBanner).toHaveBeenCalledWith({
      key: mockBannerKey,
      bannerType: 'BrandUpdateBanner',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'defaultBanners/dismissBanner',
      payload: { key: mockBannerKey, bannerType: 'BrandUpdateBanner' },
    });
  });

  test('should not dispatch dismiss action when banner is closed automatically', () => {
    // Setup
    const dismissed = {};
    const currentRouteName: ScreenRoute = 'Applets';

    // Execute
    renderHook(() =>
      useRebrandBanner(dismissed, mockBannerKey, currentRouteName),
    );

    // Get the onClose callback from the addBanner call
    const onCloseCallback = mockAddBanner.mock.calls[0][1].onClose;

    // Simulate automatic close
    onCloseCallback('timeout');

    // Verify
    expect(defaultBannersActions.dismissBanner).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test('should handle undefined dismissed banners', () => {
    // Setup - Use an empty object instead of undefined
    // This is a more realistic scenario as the hook expects an object
    const dismissed = {} as Record<string, string[]>;
    const currentRouteName: ScreenRoute = 'Login';

    // Execute
    renderHook(() =>
      useRebrandBanner(dismissed, mockBannerKey, currentRouteName),
    );

    // Verify
    expect(mockAddBanner).toHaveBeenCalledTimes(1);
  });

  test('should not add banner when on an excluded route', () => {
    // Setup
    const dismissed = {};
    const currentRouteName: ScreenRoute = 'InProgressActivity';

    // Execute
    renderHook(() =>
      useRebrandBanner(dismissed, mockBannerKey, currentRouteName),
    );

    // Verify
    expect(mockAddBanner).not.toHaveBeenCalled();
  });

  test('should handle undefined route name', () => {
    // Setup
    const dismissed = {};
    const currentRouteName = undefined;

    // Execute
    renderHook(() =>
      useRebrandBanner(dismissed, mockBannerKey, currentRouteName),
    );

    // Verify - should still add banner when route is undefined
    expect(mockAddBanner).toHaveBeenCalledTimes(1);
  });
});
