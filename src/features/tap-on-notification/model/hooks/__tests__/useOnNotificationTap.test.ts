import { renderHook } from '@testing-library/react-native';

import { useOnNotificationTap } from '../useOnNotificationTap';

type TapCallback = (detail: unknown) => void;

let mockOnTap: TapCallback | undefined;
const mockNavigate = jest.fn();
const mockRefresh = jest.fn(() => Promise.resolve());
const mockIsUnityTaskOnScreen = jest.fn(() => false);

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({}),
}));

jest.mock('@app/entities/unity/lib/hook/useUnityLifecycle', () => ({
  isUnityTaskOnScreen: () => mockIsUnityTaskOnScreen(),
}));

jest.mock('@app/entities/notification/lib/hooks/useForegroundEvents', () => ({
  useForegroundEvents: ({ onPress }: { onPress: TapCallback }) => {
    mockOnTap = onPress;
  },
}));

jest.mock('@app/entities/applet/model/hooks/useRefreshMutation', () => ({
  useRefreshMutation: () => ({ mutateAsync: mockRefresh }),
}));

jest.mock('@app/entities/applet/model/hooks/useStartEntity', () => ({
  useStartEntity: () => ({ startFlow: jest.fn(), startActivity: jest.fn() }),
}));

jest.mock('@app/screens/model/checkEntityAvailability', () => ({
  checkEntityAvailability: jest.fn(),
}));

jest.mock('@app/shared/lib/hooks/redux', () => ({
  useAppSelector: () => ({}),
}));

jest.mock('@app/shared/lib/hooks/useCurrentRoute', () => ({
  useCurrentRoute: () => ({ getCurrentRoute: () => 'Applets' }),
}));

jest.mock('@app/shared/lib/services/loggerInstance', () => ({
  getDefaultLogger: () => ({
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    send: jest.fn(),
  }),
}));

const appletUpdateTap = {
  notification: { data: { type: 'applet-update-alert' } },
};

describe('useOnNotificationTap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderHook(() =>
      useOnNotificationTap({
        hasMediaReferences: jest.fn(),
        cleanUpMediaFiles: jest.fn(),
        hasActivityWithHiddenAllItems: jest.fn(),
        evaluateAvailableTo: jest.fn(),
        completeEntityIntoUploadToQueue: jest.fn(),
      }),
    );
  });

  test('ignores a tap while a Unity task is on screen', () => {
    mockIsUnityTaskOnScreen.mockReturnValue(true);

    mockOnTap?.(appletUpdateTap);

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  test('handles a tap when no Unity task is on screen', () => {
    mockIsUnityTaskOnScreen.mockReturnValue(false);

    mockOnTap?.(appletUpdateTap);

    expect(mockNavigate).toHaveBeenCalledWith('Applets', undefined, {
      pop: true,
    });
    expect(mockRefresh).toHaveBeenCalled();
  });
});
