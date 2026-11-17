import { Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { act, render, waitFor } from '@testing-library/react-native';

import { useQueueProcessing } from '@app/entities/activity/lib/hooks/useQueueProcessing';
import { useRetryUpload } from '@app/entities/activity/lib/hooks/useRetryUpload';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { AutoCompletion } from './AutoCompletion';
import { useAutoCompletion } from '../../model/hooks/useAutoCompletion';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
jest.mock('@app/entities/activity/lib/hooks/useQueueProcessing', () => ({
  useQueueProcessing: jest.fn(),
}));
jest.mock('@app/entities/activity/lib/hooks/useRetryUpload', () => ({
  useRetryUpload: jest.fn(),
}));
jest.mock('../../model/hooks/useAutoCompletion', () => ({
  useAutoCompletion: jest.fn(),
}));
jest.mock('@app/shared/lib/observables/uploadObservableInstance', () => ({
  getDefaultUploadObservable: () => ({ isPostponed: false }),
}));
jest.mock('./AnswersSubmitted', () => ({
  AnswersSubmitted: () => <Text>answers-submitted</Text>,
}));
jest.mock('./ProcessingAnswers', () => ({
  ProcessingAnswers: () => <Text>processing-answers</Text>,
}));
jest.mock('./containers', () => ({
  SubScreenContainer: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  ),
}));

type Listener = () => void;

describe('AutoCompletion', () => {
  const mockUseNavigation = useNavigation as jest.Mock;
  const mockUseQueueProcessing = useQueueProcessing as jest.Mock;
  const mockUseRetryUpload = useRetryUpload as jest.Mock;
  const mockUseAutoCompletion = useAutoCompletion as jest.Mock;

  let listeners: Record<string, Listener[]>;
  let goBack: jest.Mock;
  let processWithAutocompletion: jest.Mock;
  let evaluateIfItemsInQueueExist: jest.Mock;

  // Simulates React Navigation firing a screen event.
  const emit = (event: 'focus' | 'blur') => {
    act(() => {
      (listeners[event] ?? []).forEach(listener => listener());
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    listeners = {};
    goBack = jest.fn();
    processWithAutocompletion = jest.fn().mockResolvedValue(true);
    evaluateIfItemsInQueueExist = jest.fn().mockReturnValue(false);

    mockUseNavigation.mockReturnValue({
      goBack,
      addListener: jest.fn((event: string, listener: Listener) => {
        listeners[event] = [...(listeners[event] ?? []), listener];
        return () => {
          listeners[event] = listeners[event].filter(l => l !== listener);
        };
      }),
    });
    mockUseQueueProcessing.mockReturnValue({
      isCompleted: false,
      process: jest.fn(),
    });
    mockUseRetryUpload.mockReturnValue({
      isAlertOpened: false,
      openAlert: jest.fn(),
    });
    mockUseAutoCompletion.mockReturnValue({
      process: processWithAutocompletion,
      evaluateIfItemsInQueueExist,
    });

    const logger = getDefaultLogger();
    jest.spyOn(logger, 'log').mockReturnValue(undefined);
    jest.spyOn(logger, 'warn').mockReturnValue(undefined);
  });

  it('processes the queue once on mount', async () => {
    render(<AutoCompletion />);

    await waitFor(() =>
      expect(processWithAutocompletion).toHaveBeenCalledTimes(1),
    );
  });

  it('does nothing extra on the first focus after mount', async () => {
    render(<AutoCompletion />);
    await waitFor(() =>
      expect(processWithAutocompletion).toHaveBeenCalledTimes(1),
    );

    emit('focus');

    expect(processWithAutocompletion).toHaveBeenCalledTimes(1);
    expect(goBack).not.toHaveBeenCalled();
  });

  it('closes when revealed again with an empty queue', async () => {
    evaluateIfItemsInQueueExist.mockReturnValue(false);
    render(<AutoCompletion />);
    await waitFor(() =>
      expect(processWithAutocompletion).toHaveBeenCalledTimes(1),
    );

    emit('blur');
    emit('focus');

    expect(goBack).toHaveBeenCalledTimes(1);
    expect(processWithAutocompletion).toHaveBeenCalledTimes(1);
  });

  it('uploads again when revealed with items still queued', async () => {
    evaluateIfItemsInQueueExist.mockReturnValue(true);
    render(<AutoCompletion />);
    await waitFor(() =>
      expect(processWithAutocompletion).toHaveBeenCalledTimes(1),
    );

    emit('blur');
    emit('focus');

    await waitFor(() =>
      expect(processWithAutocompletion).toHaveBeenCalledTimes(2),
    );
    expect(goBack).not.toHaveBeenCalled();
  });

  it('handles every cover and reveal, not just the first', async () => {
    evaluateIfItemsInQueueExist.mockReturnValue(true);
    render(<AutoCompletion />);
    await waitFor(() =>
      expect(processWithAutocompletion).toHaveBeenCalledTimes(1),
    );

    emit('blur');
    emit('focus');
    await waitFor(() =>
      expect(processWithAutocompletion).toHaveBeenCalledTimes(2),
    );

    // A focus without a new blur in between is not a reveal.
    emit('focus');
    expect(processWithAutocompletion).toHaveBeenCalledTimes(2);

    emit('blur');
    emit('focus');
    await waitFor(() =>
      expect(processWithAutocompletion).toHaveBeenCalledTimes(3),
    );
  });

  it('removes its focus and blur listeners on unmount', () => {
    const { unmount } = render(<AutoCompletion />);

    unmount();

    expect(listeners.focus ?? []).toHaveLength(0);
    expect(listeners.blur ?? []).toHaveLength(0);
  });
});
