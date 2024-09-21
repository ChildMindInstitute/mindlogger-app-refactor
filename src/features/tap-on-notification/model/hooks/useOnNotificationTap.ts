/* eslint-disable @typescript-eslint/no-floating-promises */
import { useCallback, useEffect, useRef } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  ActivityRecordKeyParams,
  AutocompletionEventOptions,
  CheckAvailability,
  CompleteEntityIntoUploadToQueue,
  EntityPath,
  EntityProgressionInProgress,
  EntityType,
  EvaluateAvailableTo,
  LookupEntityInput,
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
  getEntityProgression,
  HourMinute,
  isEntityProgressionInProgress,
  Logger,
  MixEvents,
  MixProperties,
  useAppSelector,
  useCurrentRoute,
  useToast,
} from '@app/shared/lib';

import NotificationPostponer from '../services/NotificationPostponer';

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

  const toast = useToast();

  const navigator = useNavigation();

  const { t } = useTranslation();

  const progressions = useAppSelector(
    AppletModel.selectors.selectAppletsEntityProgressions,
  );

  const responseTimes = useAppSelector(
    AppletModel.selectors.selectEntityResponseTimes,
  );

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

  const postponerRef = useRef(new NotificationPostponer());

  postponerRef.current.getCurrentRoute = getCurrentRoute;

  const actions: Record<
    PushNotificationType,
    (eventDetail: LocalEventDetail) => void
  > = {
    'request-to-reschedule-due-to-limit': () => {
      NotificationModel.NotificationRefreshService.refresh(
        queryClient,
        progressions,
        responseTimes,
        LogTrigger.LimitReachedNotification,
      );
    },
    'schedule-event-alert': eventDetail => {
      const {
        appletId,
        activityId,
        activityFlowId,
        eventId,
        targetSubjectId,
        entityName,
      } = eventDetail.notification.data;

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
          startEntity(
            appletId!,
            entityId,
            entityType,
            eventId!,
            entityName!,
            targetSubjectId!,
          );
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
            progressions,
            responseTimes,
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
            progressions,
            responseTimes,
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
            progressions,
            responseTimes,
            LogTrigger.AppletUpdated,
          );
        })
        .then(() => Logger.send());
    },
  };

  const actionsRef = useRef(actions);

  function navigateSurvey({
    appletId,
    eventId,
    entityId,
    entityType,
    targetSubjectId,
  }: EntityPath) {
    navigator.navigate('InProgressActivity', {
      appletId,
      eventId,
      entityId,
      entityType,
      targetSubjectId,
    });
  }

  const startEntity = async (
    appletId: string,
    entityId: string,
    entityType: EntityType,
    eventId: string,
    entityName: string,
    targetSubjectId: string | null,
  ) => {
    const progression = getEntityProgression(
      appletId,
      entityId,
      eventId,
      targetSubjectId,
      progressions,
    );

    const timer: HourMinute | null =
      new QueryDataUtils(queryClient).getEventDto(appletId, eventId)?.timers
        .timer ?? null;

    let isTimerElapsed = false;

    if (progression && timer && isEntityProgressionInProgress(progression)) {
      isTimerElapsed =
        EventModel.getTimeToComplete(
          timer,
          new Date(
            (progression as EntityProgressionInProgress).startedAtTimestamp,
          ),
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
        targetSubjectId,
      );

      if (result.failReason === 'expired-while-alert-opened') {
        return autocomplete();
      }

      if (result.failed) {
        return;
      }

      if (result.fromScratch) {
        clearStorageRecords.byEventId(eventId, targetSubjectId);
      }

      navigateSurvey({
        appletId,
        eventId,
        entityId,
        entityType,
        targetSubjectId,
      });
    } else {
      const result = await startActivity(
        appletId,
        entityId,
        eventId,
        entityName,
        isTimerElapsed,
        targetSubjectId,
      );

      if (result.failReason === 'expired-while-alert-opened') {
        return autocomplete();
      }

      if (result.failed) {
        return;
      }

      if (result.fromScratch) {
        clearStorageRecords.byEventId(eventId, targetSubjectId);
      }

      navigateSurvey({
        appletId,
        eventId,
        entityId,
        entityType,
        targetSubjectId,
      });
    }
  };

  const handleWithPostponer = useCallback(
    (notificationDetail: LocalEventDetail | LocalInitialNotification) => {
      const postponer = postponerRef.current;

      postponer.reset();
      postponer.action = () => {
        const action =
          actionsRef.current[notificationDetail.notification.data.type];
        action?.(notificationDetail);
      };

      if (!postponer.tryExecute()) {
        toast.show(t('firebase_messaging:postponed_notification'));
      }
    },
    [t, toast],
  );

  useForegroundEvents({
    onPress: (eventDetail: LocalEventDetail) => {
      handleWithPostponer(eventDetail);
    },
  });

  useBackgroundEvents({
    onPress: (eventDetail: LocalEventDetail) => {
      handleWithPostponer(eventDetail);
    },
  });

  useOnInitialAndroidNotification(
    (initialNotification: LocalInitialNotification) => {
      handleWithPostponer(initialNotification);
    },
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => postponerRef.current.reset();
  }, []);
}
