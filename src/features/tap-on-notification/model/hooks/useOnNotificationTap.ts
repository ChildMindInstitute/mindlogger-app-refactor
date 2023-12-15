import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

import {
  ActivityRecordKeyParams,
  EntityPath,
  EntityType,
  LookupEntityInput,
  StoreProgress,
} from '@app/abstract/lib';
import { AppletModel, clearStorageRecords } from '@app/entities/applet';
import {
  LocalEventDetail,
  LocalInitialNotification,
  NotificationModel,
  PushNotificationType,
  useBackgroundEvents,
  useForegroundEvents,
  useOnInitialAndroidNotification,
} from '@app/entities/notification';
import { LogTrigger } from '@app/shared/api';
import { Logger, useAppSelector, useCurrentRoute } from '@app/shared/lib';

type Input = {
  checkAvailability: (entityName: string, identifiers: EntityPath) => boolean;
  hasMediaReferences: (input: LookupEntityInput) => boolean;
  hasActivityWithHiddenAllItems: (input: LookupEntityInput) => boolean;
  cleanUpMediaFiles: (keyParams: ActivityRecordKeyParams) => void;
};

const GoBackDuration = 1000;

/*
https://mindlogger.atlassian.net/browse/M2-1810
We don't know the exact reason yet.
The bug is fluent.
I've observed console.log exactly at the line before Alert.show, but the alert hasn't been shown!.
Probably this is because of notification re-schedule at the same moment, and all notifications deleted via notify api
and as a result - the current notification-tap thread and all the related threads (created by promises) - canceled, just supposition.
Sometimes I've observed the Alert right after 10-20 seconds, probably because of reload of bundle or because I switched the app from background to foreground
(like modals sometimes hidden and shown on Windows OS if to click alt+tab) - not sure here.
*/
const WorkaroundDuration = 100;

export function useOnNotificationTap({
  checkAvailability,
  hasMediaReferences,
  cleanUpMediaFiles,
  hasActivityWithHiddenAllItems,
}: Input) {
  const queryClient = useQueryClient();

  const navigator = useNavigation();

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const completions = useAppSelector(AppletModel.selectors.selectCompletions);

  const { mutateAsync: refresh } = AppletModel.useRefreshMutation();

  const { startFlow, startActivity } = AppletModel.useStartEntity({
    hasMediaReferences,
    cleanUpMediaFiles,
    hasActivityWithHiddenAllItems,
  });

  const { getCurrentRoute } = useCurrentRoute();

  const actions: Record<
    PushNotificationType,
    (eventDetail: LocalEventDetail) => void
  > = {
    'request-to-reschedule-due-to-limit': () => {
      NotificationModel.NotificationRefreshService.refresh(
        queryClient,
        storeProgress,
        completions,
        LogTrigger.LimitReachedNotification,
      );
    },
    'schedule-event-alert': eventDetail => {
      const { appletId, activityId, activityFlowId, eventId, entityName } =
        eventDetail.notification.data;

      const entityId: string = (activityId ?? activityFlowId)!;

      const entityType: EntityType = activityFlowId ? 'flow' : 'regular';

      const executing = getCurrentRoute() === 'InProgressActivity';
      console.log(getCurrentRoute(), 'getCurrentRoute');

      if (executing) {
        navigator.goBack();
      }

      setTimeout(
        () => {
          startEntity(appletId!, entityId, entityType, eventId!, entityName!);
        },
        executing ? GoBackDuration : WorkaroundDuration,
      );
    },
    'response-data-alert': () => {},
    'applet-update-alert': () => {
      navigator.navigate('Applets');

      refresh()
        .then(() => {
          NotificationModel.NotificationRefreshService.refresh(
            queryClient,
            storeProgress,
            completions,
            LogTrigger.ScheduleUpdated,
          );
        })
        .then(() => Logger.send());
    },
    'applet-delete-alert': () => {
      navigator.navigate('Applets');

      refresh()
        .then(() => {
          NotificationModel.NotificationRefreshService.refresh(
            queryClient,
            storeProgress,
            completions,
            LogTrigger.AppletRemoved,
          );
        })
        .then(() => Logger.send());
    },
    'schedule-updated': () => {
      navigator.navigate('Applets');

      refresh()
        .then(() => {
          NotificationModel.NotificationRefreshService.refresh(
            queryClient,
            storeProgress,
            completions,
            LogTrigger.AppletUpdated,
          );
        })
        .then(() => Logger.send());
    },
  };

  function navigateSurvey({
    appletId,
    eventId,
    entityId,
    entityType,
  }: EntityPath) {
    navigator.navigate('InProgressActivity', {
      appletId,
      eventId,
      entityId,
      entityType,
    });
  }

  const startEntity = (
    appletId: string,
    entityId: string,
    entityType: EntityType,
    eventId: string,
    entityName: string,
  ) => {
    if (
      !checkAvailability(entityName, {
        appletId,
        eventId,
        entityId,
        entityType,
      })
    ) {
      return;
    }

    if (entityType === 'flow') {
      startFlow(appletId, entityId, eventId, entityName).then(
        ({
          startedFromScratch,
          cannotBeStartedDueToMediaFound,
          cannotBeStartedDueToAllItemsHidden,
        }) => {
          if (
            cannotBeStartedDueToMediaFound ||
            cannotBeStartedDueToAllItemsHidden
          ) {
            return;
          }

          if (startedFromScratch) {
            clearStorageRecords.byEventId(eventId);
          }

          navigateSurvey({ appletId, eventId, entityId, entityType });
        },
      );
    } else {
      startActivity(appletId, entityId, eventId, entityName).then(
        ({
          startedFromScratch,
          cannotBeStartedDueToMediaFound,
          cannotBeStartedDueToAllItemsHidden,
        }) => {
          if (
            cannotBeStartedDueToMediaFound ||
            cannotBeStartedDueToAllItemsHidden
          ) {
            return;
          }

          if (startedFromScratch) {
            clearStorageRecords.byEventId(eventId);
          }

          navigateSurvey({ appletId, eventId, entityId, entityType });
        },
      );
    }
  };

  useForegroundEvents({
    onPress: (eventDetail: LocalEventDetail) => {
      const action = actions[eventDetail.notification.data.type];

      action?.(eventDetail);
    },
  });

  useBackgroundEvents({
    onPress: (eventDetail: LocalEventDetail) => {
      const action = actions[eventDetail.notification.data.type];

      action?.(eventDetail);
    },
  });

  useOnInitialAndroidNotification(
    (initialNotification: LocalInitialNotification) => {
      const action = actions[initialNotification.notification.data.type];

      action?.(initialNotification);
    },
  );
}
