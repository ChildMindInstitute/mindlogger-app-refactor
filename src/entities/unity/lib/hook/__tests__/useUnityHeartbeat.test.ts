import { renderHook, act } from '@testing-library/react-native';

import {
  HEARTBEAT_INTERVAL_MS,
  HEARTBEAT_TIMEOUT_MS,
  MAX_HEARTBEAT_FAILURES,
} from '../../constants';
import { useUnityHeartbeat } from '../useUnityHeartbeat';

jest.mock('@app/shared/lib/services/loggerInstance', () => ({
  getDefaultLogger: () => ({
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

describe('useUnityHeartbeat', () => {
  const mockSendMessage = jest.fn();
  const mockOnFirstFailure = jest.fn();
  const mockOnMaxFailuresReached = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockSendMessage.mockResolvedValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderHeartbeat = () =>
    renderHook(() =>
      useUnityHeartbeat({
        sendMessageToUnity: mockSendMessage,
        onFirstFailure: mockOnFirstFailure,
        onMaxFailuresReached: mockOnMaxFailuresReached,
      }),
    );

  test('startHeartbeat sends Echo at each interval', () => {
    const { result } = renderHeartbeat();

    act(() => result.current.startHeartbeat());

    expect(mockSendMessage).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(HEARTBEAT_INTERVAL_MS));
    expect(mockSendMessage).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(HEARTBEAT_INTERVAL_MS));
    expect(mockSendMessage).toHaveBeenCalledTimes(2);

    act(() => result.current.stopHeartbeat());
  });

  test('stopHeartbeat clears the interval', () => {
    const { result } = renderHeartbeat();

    act(() => result.current.startHeartbeat());
    act(() => jest.advanceTimersByTime(HEARTBEAT_INTERVAL_MS));
    expect(mockSendMessage).toHaveBeenCalledTimes(1);

    act(() => result.current.stopHeartbeat());

    act(() => jest.advanceTimersByTime(HEARTBEAT_INTERVAL_MS * 3));
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
  });

  test('calls onFirstFailure after first Echo timeout', async () => {
    mockSendMessage.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHeartbeat();

    act(() => result.current.startHeartbeat());

    // Trigger first Echo
    act(() => jest.advanceTimersByTime(HEARTBEAT_INTERVAL_MS));

    // Wait for timeout
    act(() => jest.advanceTimersByTime(HEARTBEAT_TIMEOUT_MS));

    expect(mockOnFirstFailure).toHaveBeenCalledTimes(1);
    expect(mockOnMaxFailuresReached).not.toHaveBeenCalled();

    act(() => result.current.stopHeartbeat());
  });

  test('calls onMaxFailuresReached after consecutive failures', async () => {
    mockSendMessage.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHeartbeat();

    act(() => result.current.startHeartbeat());

    for (let i = 0; i < MAX_HEARTBEAT_FAILURES; i++) {
      act(() => jest.advanceTimersByTime(HEARTBEAT_INTERVAL_MS));
      act(() => jest.advanceTimersByTime(HEARTBEAT_TIMEOUT_MS));
    }

    expect(mockOnFirstFailure).toHaveBeenCalledTimes(1);
    expect(mockOnMaxFailuresReached).toHaveBeenCalledTimes(1);
  });

  test('resets failure count on successful Echo', async () => {
    // First call: hangs (will timeout)
    mockSendMessage.mockImplementationOnce(() => new Promise(() => {}));
    // Second call: resolves immediately
    mockSendMessage.mockImplementationOnce(() => Promise.resolve(null));
    // Third+ calls: hang (will timeout)
    mockSendMessage.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHeartbeat();

    act(() => result.current.startHeartbeat());

    // 1st Echo → timeout → failure #1
    act(() => jest.advanceTimersByTime(HEARTBEAT_INTERVAL_MS));
    act(() => jest.advanceTimersByTime(HEARTBEAT_TIMEOUT_MS));
    expect(mockOnFirstFailure).toHaveBeenCalledTimes(1);

    // 2nd Echo → advance just enough to trigger the interval tick,
    // then flush microtasks so the Promise.resolve .then() runs
    // and clears the timeout before it fires.
    await act(async () => {
      jest.advanceTimersByTime(HEARTBEAT_INTERVAL_MS - HEARTBEAT_TIMEOUT_MS);
    });

    // 3rd Echo → timeout → failure count should be 1 again (not 2)
    act(() => jest.advanceTimersByTime(HEARTBEAT_INTERVAL_MS));
    act(() => jest.advanceTimersByTime(HEARTBEAT_TIMEOUT_MS));

    // onFirstFailure called again (count was reset to 0, now back to 1)
    expect(mockOnFirstFailure).toHaveBeenCalledTimes(2);
    // Should NOT have reached max because count was reset between failures
    expect(mockOnMaxFailuresReached).not.toHaveBeenCalled();

    act(() => result.current.stopHeartbeat());
  });

  test('calls onMaxFailuresReached when send rejects', async () => {
    mockSendMessage.mockRejectedValue(new Error('bridge dead'));

    const { result } = renderHeartbeat();

    act(() => result.current.startHeartbeat());

    for (let i = 0; i < MAX_HEARTBEAT_FAILURES; i++) {
      await act(async () => {
        jest.advanceTimersByTime(HEARTBEAT_INTERVAL_MS);
      });
    }

    expect(mockOnMaxFailuresReached).toHaveBeenCalledTimes(1);

    // Heartbeat should auto-stop after max failures
    expect(result.current.isHeartbeatRunning()).toBe(false);
  });
});
