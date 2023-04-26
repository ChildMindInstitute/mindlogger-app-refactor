import {
  EventDetail,
  EventType,
  InitialNotification,
  Notification,
  TriggerNotification,
} from '@notifee/react-native';

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

export type LocalNotificationType =
  | 'schedule-event-alert'
  | 'request-to-reschedule-due-to-limit';

export type LocalEventNotification = Notification & {
  data: {
    shortId?: string;
    scheduledAt: number;
    scheduledAtString: string;
    appletId?: string;
    activityId?: string;
    activityFlowId?: string;
    eventId?: string;
    isLocal: 'true' | 'false';
    type: 'schedule-event-alert' | 'request-to-reschedule-due-to-limit';
  };
};

export type LocalEventTriggerNotification = TriggerNotification & {
  notification: LocalEventNotification;
};

export type LocalEventDetail = EventDetail & {
  notification: LocalEventNotification;
};

export type LocalInitialNotification = InitialNotification & {
  notification: LocalEventNotification;
};
