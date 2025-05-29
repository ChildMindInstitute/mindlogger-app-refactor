import { renderHook } from '@testing-library/react-native';

import { useAppDispatch } from '@app/shared/lib/hooks/redux';

import { useBanners } from './useBanners';
import { BannerOrder, bannerActions } from '../../model/slice';

// Mock dependencies
jest.mock('@app/shared/lib/hooks/redux', () => ({
  useAppDispatch: jest.fn(),
}));

// Mock banner actions
jest.mock('../../model/slice', () => ({
  ...jest.requireActual('../../model/slice'),
  bannerActions: {
    addBanner: jest.fn(payload => ({ type: 'banners/addBanner', payload })),
    removeBanner: jest.fn(payload => ({
      type: 'banners/removeBanner',
      payload,
    })),
    removeAllBanners: jest.fn(() => ({ type: 'banners/removeAllBanners' })),
  },
}));

describe('useBanners', () => {
  // Setup mock values
  const mockDispatch = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup default mock returns
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  test('addBanner dispatches action with string content', () => {
    // Setup
    const { result } = renderHook(() => useBanners());
    const bannerMessage = 'Test banner message';

    // Execute
    result.current.addBanner('SuccessBanner', bannerMessage);

    // Verify
    expect(bannerActions.addBanner).toHaveBeenCalledWith({
      key: 'SuccessBanner',
      bannerProps: { children: bannerMessage },
      order: BannerOrder.Default,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'banners/addBanner',
      payload: {
        key: 'SuccessBanner',
        bannerProps: { children: bannerMessage },
        order: BannerOrder.Default,
      },
    });
  });

  test('addBanner dispatches action with null content', () => {
    // Setup
    const { result } = renderHook(() => useBanners());

    // Execute
    result.current.addBanner('ErrorBanner', null);

    // Verify
    expect(bannerActions.addBanner).toHaveBeenCalledWith({
      key: 'ErrorBanner',
      bannerProps: { children: null },
      order: BannerOrder.Default,
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('addBanner dispatches action with object content', () => {
    // Setup
    const { result } = renderHook(() => useBanners());
    const bannerProps = {
      children: 'Test message',
      duration: 3000,
      hasCloseButton: true,
    };

    // Execute
    result.current.addBanner('WarningBanner', bannerProps, BannerOrder.Top);

    // Verify
    expect(bannerActions.addBanner).toHaveBeenCalledWith({
      key: 'WarningBanner',
      bannerProps,
      order: BannerOrder.Top,
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('addSuccessBanner calls addBanner with correct type', () => {
    // Setup
    const { result } = renderHook(() => useBanners());
    const bannerMessage = 'Success message';

    // Execute
    result.current.addSuccessBanner(bannerMessage);

    // Verify
    expect(bannerActions.addBanner).toHaveBeenCalledWith({
      key: 'SuccessBanner',
      bannerProps: { children: bannerMessage },
      order: BannerOrder.Default,
    });
  });

  test('addErrorBanner calls addBanner with correct type', () => {
    // Setup
    const { result } = renderHook(() => useBanners());
    const bannerMessage = 'Error message';

    // Execute
    result.current.addErrorBanner(bannerMessage);

    // Verify
    expect(bannerActions.addBanner).toHaveBeenCalledWith({
      key: 'ErrorBanner',
      bannerProps: { children: bannerMessage },
      order: BannerOrder.Default,
    });
  });

  test('addWarningBanner calls addBanner with correct type', () => {
    // Setup
    const { result } = renderHook(() => useBanners());
    const bannerMessage = 'Warning message';

    // Execute
    result.current.addWarningBanner(bannerMessage);

    // Verify
    expect(bannerActions.addBanner).toHaveBeenCalledWith({
      key: 'WarningBanner',
      bannerProps: { children: bannerMessage },
      order: BannerOrder.Default,
    });
  });

  test('addInfoBanner calls addBanner with correct type', () => {
    // Setup
    const { result } = renderHook(() => useBanners());
    const bannerMessage = 'Info message';

    // Execute
    result.current.addInfoBanner(bannerMessage);

    // Verify
    expect(bannerActions.addBanner).toHaveBeenCalledWith({
      key: 'InfoBanner',
      bannerProps: { children: bannerMessage },
      order: BannerOrder.Default,
    });
  });

  test('removeBanner dispatches action with correct key', () => {
    // Setup
    const { result } = renderHook(() => useBanners());

    // Execute
    result.current.removeBanner('SuccessBanner');

    // Verify
    expect(bannerActions.removeBanner).toHaveBeenCalledWith('SuccessBanner');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'banners/removeBanner',
      payload: 'SuccessBanner',
    });
  });

  test('removeSuccessBanner calls removeBanner with correct type', () => {
    // Setup
    const { result } = renderHook(() => useBanners());

    // Execute
    result.current.removeSuccessBanner();

    // Verify
    expect(bannerActions.removeBanner).toHaveBeenCalledWith('SuccessBanner');
  });

  test('removeErrorBanner calls removeBanner with correct type', () => {
    // Setup
    const { result } = renderHook(() => useBanners());

    // Execute
    result.current.removeErrorBanner();

    // Verify
    expect(bannerActions.removeBanner).toHaveBeenCalledWith('ErrorBanner');
  });

  test('removeWarningBanner calls removeBanner with correct type', () => {
    // Setup
    const { result } = renderHook(() => useBanners());

    // Execute
    result.current.removeWarningBanner();

    // Verify
    expect(bannerActions.removeBanner).toHaveBeenCalledWith('WarningBanner');
  });

  test('removeInfoBanner calls removeBanner with correct type', () => {
    // Setup
    const { result } = renderHook(() => useBanners());

    // Execute
    result.current.removeInfoBanner();

    // Verify
    expect(bannerActions.removeBanner).toHaveBeenCalledWith('InfoBanner');
  });

  test('removeAllBanners dispatches correct action', () => {
    // Setup
    const { result } = renderHook(() => useBanners());

    // Execute
    result.current.removeAllBanners();

    // Verify
    expect(bannerActions.removeAllBanners).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'banners/removeAllBanners',
    });
  });
});
