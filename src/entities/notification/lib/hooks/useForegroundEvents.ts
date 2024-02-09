import { useRef, useEffect } from 'react';

import notifee, { EventType } from '@notifee/react-native';

import { LocalEventDetail, NotificationEventCallbacks, NotificationEventHandlersFunctions } from '../types';

export type UseForegroundEventArgs = Partial<NotificationEventCallbacks>;

export function useForegroundEvents({
  onDismissed,
  onPress,
  onActionPress,
  onDelivered,
  onAppBlocked,
  onChannelBlocked,
  onChannelGroupBlocked,
  onTriggerNotificationCreated,
  onFGAlreadyExists,
  onUnknown,
}: UseForegroundEventArgs) {
  const callbackRefs = useRef<UseForegroundEventArgs>({
    onDismissed,
    onPress,
    onActionPress,
    onDelivered,
    onAppBlocked,
    onChannelBlocked,
    onChannelGroupBlocked,
    onTriggerNotificationCreated,
    onFGAlreadyExists,
    onUnknown,
  });

  callbackRefs.current = {
    onDismissed,
    onPress,
    onActionPress,
    onDelivered,
    onAppBlocked,
    onChannelBlocked,
    onChannelGroupBlocked,
    onTriggerNotificationCreated,
    onFGAlreadyExists,
    onUnknown,
  };

  useEffect(() => {
    const EventCallbacks: Partial<NotificationEventHandlersFunctions> = {
      [EventType.DISMISSED]: () => callbackRefs.current.onDismissed,
      [EventType.PRESS]: () => callbackRefs.current.onPress,
      [EventType.UNKNOWN]: () => callbackRefs.current.onUnknown,
      [EventType.ACTION_PRESS]: () => callbackRefs.current.onActionPress,
      [EventType.DELIVERED]: () => callbackRefs.current.onDelivered,
      [EventType.APP_BLOCKED]: () => callbackRefs.current.onAppBlocked,
      [EventType.CHANNEL_BLOCKED]: () => callbackRefs.current.onChannelBlocked,
      [EventType.CHANNEL_GROUP_BLOCKED]: () => callbackRefs.current.onChannelGroupBlocked,
      [EventType.TRIGGER_NOTIFICATION_CREATED]: () => callbackRefs.current.onTriggerNotificationCreated,
      [EventType.FG_ALREADY_EXIST]: () => callbackRefs.current.onFGAlreadyExists,
    };

    return notifee.onForegroundEvent((event) => {
      const type = event.type;

      EventCallbacks[type]?.()?.(event.detail as LocalEventDetail);
    });
  }, []);
}
