import { EventDetail, EventType } from '@notifee/react-native';

type NotificationEventCallback = (eventDetail: EventDetail) => void;

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
