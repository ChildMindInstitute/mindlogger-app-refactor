import { renderHook, act } from '@testing-library/react-native';

import { useUnityFailureHandler } from '../useUnityFailureHandler';

jest.mock('@app/shared/lib/services/loggerInstance', () => ({
  getDefaultLogger: () => ({
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

describe('useUnityFailureHandler', () => {
  const mockStopHeartbeat = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderHandler = (flowId?: string) =>
    renderHook(() =>
      useUnityFailureHandler({
        flowId,
        stopHeartbeat: mockStopHeartbeat,
        onError: mockOnError,
      }),
    );

  test('initial state: modal hidden', () => {
    const { result } = renderHandler();
    expect(result.current.showErrorModal).toBe(false);
  });

  test('triggerFailure shows modal and stops heartbeat', () => {
    const { result } = renderHandler();

    act(() => result.current.triggerFailure());

    expect(result.current.showErrorModal).toBe(true);
    expect(mockStopHeartbeat).toHaveBeenCalledTimes(1);
  });

  test('triggerFailure is idempotent — second call is ignored', () => {
    const { result } = renderHandler();

    act(() => result.current.triggerFailure());
    act(() => result.current.triggerFailure());

    expect(mockStopHeartbeat).toHaveBeenCalledTimes(1);
  });

  test('handleErrorModalDismiss hides modal and calls onError', () => {
    const { result } = renderHandler();

    act(() => result.current.triggerFailure());
    expect(result.current.showErrorModal).toBe(true);

    act(() => result.current.handleErrorModalDismiss());

    expect(result.current.showErrorModal).toBe(false);
    expect(mockOnError).toHaveBeenCalledTimes(1);
  });

  test('resetFailureState clears state and allows re-trigger', () => {
    const { result } = renderHandler();

    act(() => result.current.triggerFailure());
    expect(result.current.showErrorModal).toBe(true);

    act(() => result.current.resetFailureState());
    expect(result.current.showErrorModal).toBe(false);

    // Should be able to trigger again after reset
    act(() => result.current.triggerFailure());
    expect(result.current.showErrorModal).toBe(true);
    expect(mockStopHeartbeat).toHaveBeenCalledTimes(2);
  });

  test('suppressErrors prevents future triggerFailure', () => {
    const { result } = renderHandler();

    act(() => result.current.suppressErrors());
    act(() => result.current.triggerFailure());

    expect(result.current.showErrorModal).toBe(false);
    expect(mockStopHeartbeat).not.toHaveBeenCalled();
  });
});
