/* eslint-disable @typescript-eslint/no-floating-promises */
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

import {
  ActivityRecordKeyParams,
  AutocompletionEventOptions,
  CheckAvailability,
  CompleteEntityIntoUploadToQueue,
  EntityPath,
  EntityType,
  EvaluateAvailableTo,
  LookupEntityInput,
  StoreProgress,
} from '@app/abstract/lib';
import { AppletModel, clearStorageRecords } from '@app/entities/applet';
import { EventModel } from '@app/entities/event';
import {
  LocalEventDetail,
  LocalInitialNotification,
  NotificationModel,
  PushNotificationType,
  useBackgroundEvents,
  useForegroundEvents,
  useOnInitialAndroidNotification,
} from '@app/entities/notification';
import { LogTrigger, QueryDataUtils } from '@app/shared/api';
import {
  AnalyticsService,
  Emitter,
  getEntityProgress,
  HourMinute,
  isEntityInProgress,
  Logger,
  MixEvents,
  MixProperties,
  useAppSelector,
  useCurrentRoute,
} from '@app/shared/lib';

type Input = {
  checkAvailability: CheckAvailability;
  hasMediaReferences: (input: LookupEntityInput) => boolean;
  hasActivityWithHiddenAllItems: (input: LookupEntityInput) => boolean;
  cleanUpMediaFiles: (keyParams: ActivityRecordKeyParams) => void;
  evaluateAvailableTo: EvaluateAvailableTo;
  completeEntityIntoUploadToQueue: CompleteEntityIntoUploadToQueue;
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
  evaluateAvailableTo,
  completeEntityIntoUploadToQueue,
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
    evaluateAvailableTo,
    completeEntityIntoUploadToQueue,
    checkAvailability,
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

      const isAutocompletionWorking = getCurrentRoute() === 'Autocompletion';

      AnalyticsService.track(MixEvents.NotificationTap, {
        [MixProperties.AppletId]: appletId,
      });

      if (executing) {
        navigator.goBack();
      }

      if (isAutocompletionWorking) {
        Logger.log(
          '[useOnNotificationTap]: Notification tap ignored as autocompletion is working (M2-7315)',
        );
        return;
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

  const startEntity = async (
    appletId: string,
    entityId: string,
    entityType: EntityType,
    eventId: string,
    entityName: string,
  ) => {
    const progressRecord = getEntityProgress(
      appletId,
      entityId,
      eventId,
      storeProgress,
    );

    const timer: HourMinute | null =
      new QueryDataUtils(queryClient).getEventDto(appletId, eventId)?.timers
        .timer ?? null;

    let isTimerElapsed = false;

    if (progressRecord && timer && isEntityInProgress(progressRecord)) {
      isTimerElapsed =
        EventModel.getTimeToComplete(
          timer,
          new Date(progressRecord.startAt),
        ) === null;
    }

    const autocomplete = () => {
      Emitter.emit<AutocompletionEventOptions>('autocomplete', {
        logTrigger: 'expired-while-alert-opened',
      });
    };

    if (entityType === 'flow') {
      const result = await startFlow(
        appletId,
        entityId,
        eventId,
        entityName,
        isTimerElapsed,
      );

      if (result.failReason === 'expired-while-alert-opened') {
        return autocomplete();
      }

      if (result.failed) {
        return;
      }

      if (result.fromScratch) {
        clearStorageRecords.byEventId(eventId);
      }

      navigateSurvey({ appletId, eventId, entityId, entityType });
    } else {
      const result = await startActivity(
        appletId,
        entityId,
        eventId,
        entityName,
        isTimerElapsed,
      );

      if (result.failReason === 'expired-while-alert-opened') {
        return autocomplete();
      }

      if (result.failed) {
        return;
      }

      if (result.fromScratch) {
        clearStorageRecords.byEventId(eventId);
      }

      navigateSurvey({ appletId, eventId, entityId, entityType });
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
