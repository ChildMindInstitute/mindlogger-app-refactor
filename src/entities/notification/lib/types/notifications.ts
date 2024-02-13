import {
  EventDetail,
  EventType,
  InitialNotification,
  Notification,
  TriggerNotification,
} from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

type NotificationEventCallback = (eventDetail: LocalEventDetail) => void;

export type NotificationEventCallbacks = {
  onDismissed: NotificationEventCallback;
  onPress: NotificationEventCallback;
  onActionPress: NotificationEventCallback;
  onDelivered: NotificationEventCallback;
  onAppBlocked: NotificationEventCallback;
  onChannelBlocked: NotificationEventCallback;
  onChannelGroupBlocked: NotificationEventCallback;
  onTriggerNotificationCreated: NotificationEventCallback;
  onFGAlreadyExists: NotificationEventCallback;
  onUnknown: NotificationEventCallback;
};

export type NotificationEventHandlers = Record<
  EventType,
  NotificationEventCallback
>;

export type NotificationEventHandlersFunctions = Record<
  EventType,
  () => NotificationEventCallback | undefined
>;

type LocalNotificationType =
  | 'schedule-event-alert'
  | 'request-to-reschedule-due-to-limit';

type RemoteNotificationType =
  | 'response-data-alert'
  | 'applet-update-alert'
  | 'applet-delete-alert'
  | 'schedule-updated';

export type PushNotificationType =
  | LocalNotificationType
  | RemoteNotificationType;

export type EventPushNotification = Notification & {
  data: {
    shortId?: string;
    scheduledAt: number;
    scheduledAtString: string;
    appletId?: string;
    activityId?: string;
    activityFlowId?: string;
    eventId?: string;
    entityName?: string;
    isLocal: 'true' | 'false';
    type: PushNotificationType;
  };
};

export type LocalEventTriggerNotification = TriggerNotification & {
  notification: EventPushNotification;
};

export type LocalEventDetail = EventDetail & {
  notification: EventPushNotification;
};

export type LocalInitialNotification = InitialNotification & {
  notification: EventPushNotification;
};

export type RemoteNotification = FirebaseMessagingTypes.RemoteMessage;

export type RemoteNotificationPayload = {
  title: string;
  body: string;
  data: {
    appletId: string;
    type: RemoteNotificationType;
  };
};
