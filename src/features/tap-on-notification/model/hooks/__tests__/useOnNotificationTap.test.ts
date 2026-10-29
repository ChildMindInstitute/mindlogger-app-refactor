import { renderHook } from '@testing-library/react-native';

import { PushNotificationType } from '@app/entities/notification/lib/types/notifications';

import { useOnNotificationTap } from '../useOnNotificationTap';

type TapCallback = (detail: unknown) => void;

let mockOnTap: TapCallback | undefined;
let mockCurrentRoute = 'Applets';
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockRefresh = jest.fn(() => Promise.resolve());
const mockRescheduleNotifications = jest.fn();
const mockIsUnityTaskOnScreen = jest.fn(() => false);

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
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

jest.mock(
  '@app/entities/notification/model/notificationRefreshServiceInstance',
  () => ({
    getDefaultNotificationRefreshService: () => ({
      refresh: mockRescheduleNotifications,
    }),
  }),
);

jest.mock('@app/entities/applet/model/hooks/useStartEntity', () => ({
  useStartEntity: () => ({}),
}));

jest.mock('@app/screens/model/checkEntityAvailability', () => ({
  checkEntityAvailability: jest.fn(),
}));

jest.mock('@app/shared/lib/hooks/redux', () => ({
  useAppSelector: () => ({}),
}));

jest.mock('@app/shared/lib/hooks/useCurrentRoute', () => ({
  useCurrentRoute: () => ({ getCurrentRoute: () => mockCurrentRoute }),
}));

jest.mock('@app/shared/lib/services/loggerInstance', () => ({
  getDefaultLogger: () => ({
    log: jest.fn(),
    info: jest.fn(),
    send: jest.fn(),
  }),
}));

// Every notification type must be listed here (enforced by the type check),
// so a new type is automatically covered by the "ignored" test below.
const allNotificationTypes: Record<PushNotificationType, true> = {
  'schedule-event-alert': true,
  'request-to-reschedule-due-to-limit': true,
  'response-data-alert': true,
  'applet-update-alert': true,
  'applet-delete-alert': true,
  'schedule-updated': true,
};

const tap = (type: PushNotificationType) => ({
  notification: {
    data: {
      type,
      appletId: 'applet-1',
      activityId: 'activity-1',
      eventId: 'event-1',
      entityName: 'Activity 1',
    },
  },
});

describe('useOnNotificationTap', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    // Unity tasks run inside an activity
    mockCurrentRoute = 'InProgressActivity';
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

  afterEach(() => {
    // Drop the delayed activity start; these tests stop at leaving the
    // current activity.
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('while a Unity task is on screen', () => {
    test.each(Object.keys(allNotificationTypes) as PushNotificationType[])(
      'ignores a %s tap',
      type => {
        mockIsUnityTaskOnScreen.mockReturnValue(true);

        mockOnTap?.(tap(type));

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockGoBack).not.toHaveBeenCalled();
        expect(mockRefresh).not.toHaveBeenCalled();
        expect(mockRescheduleNotifications).not.toHaveBeenCalled();
        expect(jest.getTimerCount()).toBe(0);
      },
    );
  });

  describe('when no Unity task is on screen', () => {
    beforeEach(() => {
      mockIsUnityTaskOnScreen.mockReturnValue(false);
    });

    test('an activity reminder tap leaves the current activity', () => {
      mockOnTap?.(tap('schedule-event-alert'));

      expect(mockGoBack).toHaveBeenCalled();
      expect(jest.getTimerCount()).toBe(1);
    });

    test('an applet update tap goes home and refreshes', () => {
      mockOnTap?.(tap('applet-update-alert'));

      expect(mockNavigate).toHaveBeenCalledWith('Applets', undefined, {
        pop: true,
      });
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});
