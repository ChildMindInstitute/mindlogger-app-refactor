import { renderHook } from '@testing-library/react-native';

import { useStableTopInset } from './useStableTopInset';

const mockUseSafeAreaInsets = jest.fn();
const mockUseWindowDimensions = jest.fn();

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => mockUseSafeAreaInsets() as unknown,
}));

jest.mock('react-native', () => ({
  useWindowDimensions: () => mockUseWindowDimensions() as unknown,
}));

const setTopInset = (top: number) =>
  mockUseSafeAreaInsets.mockReturnValue({ top, bottom: 0, left: 0, right: 0 });

const setPortrait = () =>
  mockUseWindowDimensions.mockReturnValue({ width: 400, height: 800 });

const setLandscape = () =>
  mockUseWindowDimensions.mockReturnValue({ width: 800, height: 400 });

describe('useStableTopInset', () => {
  beforeEach(() => {
    setPortrait();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the live top inset initially', () => {
    setTopInset(30);

    const { result } = renderHook(() => useStableTopInset());

    expect(result.current).toBe(30);
  });

  it('should keep the previous value when the inset drops (e.g. status bar hidden)', () => {
    setTopInset(30);

    const { result, rerender } = renderHook(() => useStableTopInset());

    setTopInset(0);
    rerender(undefined);

    expect(result.current).toBe(30);
  });

  it('should restore without change when the inset comes back', () => {
    setTopInset(30);

    const { result, rerender } = renderHook(() => useStableTopInset());

    setTopInset(0);
    rerender(undefined);
    setTopInset(30);
    rerender(undefined);

    expect(result.current).toBe(30);
  });

  it('should ratchet up when a larger inset is reported', () => {
    setTopInset(0);

    const { result, rerender } = renderHook(() => useStableTopInset());

    expect(result.current).toBe(0);

    setTopInset(47);
    rerender(undefined);

    expect(result.current).toBe(47);
  });

  it('should reset to the live inset when orientation changes to landscape', () => {
    setTopInset(47);

    const { result, rerender } = renderHook(() => useStableTopInset());

    expect(result.current).toBe(47);

    setLandscape();
    setTopInset(0);
    rerender(undefined);

    expect(result.current).toBe(0);
  });

  it('should ratchet independently after returning to portrait', () => {
    setTopInset(47);

    const { result, rerender } = renderHook(() => useStableTopInset());

    setLandscape();
    setTopInset(0);
    rerender(undefined);

    setPortrait();
    setTopInset(47);
    rerender(undefined);

    expect(result.current).toBe(47);

    setTopInset(0);
    rerender(undefined);

    expect(result.current).toBe(47);
  });
});
