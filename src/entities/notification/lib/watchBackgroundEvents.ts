import notifee, { EventType } from '@notifee/react-native';

import { NotificationEventCallbacks, NotificationEventHandlers } from './types';

export type WatchBackgroundEventArgs = Partial<NotificationEventCallbacks>;

export function watchBackgroundEvent(callbacks: WatchBackgroundEventArgs) {
  const EventCallbacks: Partial<NotificationEventHandlers> = {
    [EventType.DISMISSED]: callbacks.onDismissed,
    [EventType.PRESS]: callbacks.onPress,
    [EventType.UNKNOWN]: callbacks.onUnknown,
    [EventType.ACTION_PRESS]: callbacks.onActionPress,
    [EventType.DELIVERED]: callbacks.onDelivered,
    [EventType.APP_BLOCKED]: callbacks.onAppBlocked,
    [EventType.CHANNEL_BLOCKED]: callbacks.onChannelBlocked,
    [EventType.CHANNEL_GROUP_BLOCKED]: callbacks.onChannelGroupBlocked,
    [EventType.TRIGGER_NOTIFICATION_CREATED]:
      callbacks.onTriggerNotificationCreated,
    [EventType.FG_ALREADY_EXIST]: callbacks.onFGAlreadyExists,
  };

  notifee.onBackgroundEvent(async event => {
    const { detail } = event;

    EventCallbacks[event.type]?.(detail);
  });
}
