import { renderHook, act } from '@testing-library/react-native';

import {
  CONFIG_LOAD_TIMEOUT_MS,
  REMOUNT_RESET_DELAY_MS,
  REMOUNT_TRANSITION_WAIT_MS,
} from '../../constants';
import { RN2UMessage } from '../../types/unityMessage';
import { useUnityLifecycle } from '../useUnityLifecycle';

const mockLogger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
jest.mock('@app/shared/lib/services/loggerInstance', () => ({
  getDefaultLogger: () => mockLogger,
}));

const mockHandlers: Record<string, (message: unknown) => void> = {};
const mockRegisterEventHandler = (
  event: string,
  handler: (message: unknown) => void,
) => {
  mockHandlers[event] = handler;
};
const mockSendMessageToUnity = jest.fn();
jest.mock('../useRNUnityCommBridge', () => ({
  useRNUnityCommBridge: () => ({
    sendMessageToUnity: mockSendMessageToUnity,
    registerEventHandler: mockRegisterEventHandler,
    handleMessageFromUnity: jest.fn(),
  }),
}));

const mockStartHeartbeat = jest.fn();
const mockStopHeartbeat = jest.fn();
jest.mock('../useUnityHeartbeat', () => ({
  useUnityHeartbeat: () => ({
    startHeartbeat: mockStartHeartbeat,
    stopHeartbeat: mockStopHeartbeat,
  }),
}));

type TransitionEndEvent = { data: { closing: boolean } };
let mockTransitionEndListener: ((e: TransitionEndEvent) => void) | undefined;
const mockRemoveTransitionListener = jest.fn();
const mockNavigation = {
  addListener: jest.fn(
    (_event: string, listener: (e: TransitionEndEvent) => void) => {
      mockTransitionEndListener = listener;
      return mockRemoveTransitionListener;
    },
  ),
};
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

jest.mock('react-native-orientation-director', () => ({
  __esModule: true,
  default: { lockTo: jest.fn() },
  Orientation: { portrait: 1, landscapeLeft: 2, landscapeRight: 3 },
}));

jest.mock('@azesmway/react-native-unity', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// How Unity answers LoadConfigFile in the current test.
let configResponse: 'ack' | 'hang' = 'ack';

const respondLikeUnity = (message: RN2UMessage) => {
  if (message.m_sKey === 'LoadConfigFile' && configResponse === 'hang') {
    return new Promise(() => {});
  }
  return Promise.resolve({ m_sId: message.m_sId, m_sKey: message.m_sKey });
};

const flushPromises = async () => {
  await act(async () => {
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }
  });
};

const advance = async (ms: number) => {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
  await flushPromises();
};

const renderLifecycle = () =>
  renderHook(() =>
    useUnityLifecycle({
      payloadFile: 'config.json',
      onResponse: jest.fn(),
      onError: jest.fn(),
    }),
  );

// Unity's engine state outlives the hook, so put it back to "never booted".
const resetEngine = () => {
  const { result, unmount } = renderLifecycle();
  act(() => result.current.handlePlayerUnload());
  unmount();
};

// Boot Unity, load a task, then leave the screen before the task ends, which
// is what the schedule window expiring does.
const leaveTaskMidRun = async () => {
  const { unmount } = renderLifecycle();
  act(() => {
    mockHandlers.UnityStarted({ m_sKey: 'UnityStarted' });
  });
  await flushPromises();
  unmount();
};

describe('useUnityLifecycle stale frame cover (M2-11244)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    configResponse = 'ack';
    mockSendMessageToUnity.mockImplementation(respondLikeUnity);
    // Reset before clearing mocks, since the reset render itself may use them.
    resetEngine();
    jest.clearAllMocks();
    mockTransitionEndListener = undefined;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('first open with a fresh engine is not covered and attaches immediately', () => {
    const { result } = renderLifecycle();

    expect(result.current.isStaleFrameCovered).toBe(false);
    expect(result.current.unityViewKey).not.toBeNull();
    expect(mockNavigation.addListener).not.toHaveBeenCalled();
  });

  test('reopen after a task was left mid-run is covered until the new config loads', async () => {
    await leaveTaskMidRun();
    configResponse = 'hang';

    const { result } = renderLifecycle();

    expect(result.current.isStaleFrameCovered).toBe(true);
    // Waits for the slide-in to finish before attaching.
    expect(result.current.unityViewKey).toBeNull();

    // The screen sliding away doesn't count.
    act(() => mockTransitionEndListener?.({ data: { closing: true } }));
    expect(result.current.unityViewKey).toBeNull();

    act(() => mockTransitionEndListener?.({ data: { closing: false } }));
    expect(result.current.unityViewKey).not.toBeNull();
    expect(mockRemoveTransitionListener).toHaveBeenCalled();

    // Reset is sent and acknowledged, but the config hasn't loaded yet.
    await advance(REMOUNT_RESET_DELAY_MS);
    expect(mockSendMessageToUnity).toHaveBeenCalledWith(
      expect.objectContaining({ m_sKey: 'Reset' }),
    );
    expect(result.current.isStaleFrameCovered).toBe(true);
  });

  test('cover lifts once Unity acknowledges the new config', async () => {
    await leaveTaskMidRun();

    const { result } = renderLifecycle();
    act(() => mockTransitionEndListener?.({ data: { closing: false } }));
    await advance(REMOUNT_RESET_DELAY_MS);

    expect(mockSendMessageToUnity).toHaveBeenCalledWith(
      expect.objectContaining({ m_sKey: 'LoadConfigFile' }),
    );
    expect(result.current.isStaleFrameCovered).toBe(false);
  });

  test('attaches after the wait limit when no transition ends', async () => {
    await leaveTaskMidRun();

    const { result } = renderLifecycle();
    expect(result.current.unityViewKey).toBeNull();

    await advance(REMOUNT_TRANSITION_WAIT_MS);

    expect(result.current.unityViewKey).not.toBeNull();
    expect(mockRemoveTransitionListener).toHaveBeenCalled();
  });

  test('if Unity never confirms the config, the error modal shows while the cover stays up', async () => {
    await leaveTaskMidRun();
    configResponse = 'hang';

    const { result } = renderLifecycle();
    act(() => mockTransitionEndListener?.({ data: { closing: false } }));
    await advance(REMOUNT_RESET_DELAY_MS);

    await advance(CONFIG_LOAD_TIMEOUT_MS);

    expect(result.current.showErrorModal).toBe(true);
    expect(result.current.isStaleFrameCovered).toBe(true);
  });
});
