/* eslint-disable @typescript-eslint/no-floating-promises */
import { useCallback, useEffect, useRef } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { AutocompletionEventOptions } from '@app/abstract/lib/types/autocompletion';
import {
  CheckAvailability,
  CompleteEntityIntoUploadToQueue,
  EntityPath,
  EntityType,
  EvaluateAvailableTo,
  LookupEntityInput,
} from '@app/abstract/lib/types/entity';
import { EntityProgressionInProgress } from '@app/abstract/lib/types/entityProgress';
import { ActivityRecordKeyParams } from '@app/abstract/lib/types/storage';
import { clearStorageRecords } from '@app/entities/applet/lib/storage/helpers';
import { useRefreshMutation } from '@app/entities/applet/model/hooks/useRefreshMutation';
import { useStartEntity } from '@app/entities/applet/model/hooks/useStartEntity';
import {
  selectAppletsEntityProgressions,
  selectEntityResponseTimes,
} from '@app/entities/applet/model/selectors';
import { getTimeToComplete } from '@app/entities/event/model/timers';
import { useBackgroundEvents } from '@app/entities/notification/lib/hooks/useBackgroundEvents';
import { useForegroundEvents } from '@app/entities/notification/lib/hooks/useForegroundEvents';
import { useOnInitialAndroidNotification } from '@app/entities/notification/lib/hooks/useOnInitialAndroidNotification';
import {
  LocalEventDetail,
  LocalInitialNotification,
  PushNotificationType,
} from '@app/entities/notification/lib/types/notifications';
import { getDefaultNotificationRefreshService } from '@app/entities/notification/model/notificationRefreshServiceInstance';
import { getDefaultAppletsService } from '@app/shared/api/services/appletsServiceInstance';
import { LogTrigger } from '@app/shared/api/services/INotificationService';
import { QueryDataUtils } from '@app/shared/api/services/QueryDataUtils';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import {
  MixEvents,
  MixProperties,
} from '@app/shared/lib/analytics/IAnalyticsService';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { useCurrentRoute } from '@app/shared/lib/hooks/useCurrentRoute';
import { useToast } from '@app/shared/lib/hooks/useToast';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { HourMinute } from '@app/shared/lib/types/dateTime';
import { getResponseTypesMap } from '@app/shared/lib/utils/responseTypes';
import {
  getEntityProgression,
  isEntityProgressionInProgress,
} from '@app/shared/lib/utils/survey/survey';

import { NotificationPostponer } from '../services/NotificationPostponer';

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

  const progressions = useAppSelector(selectAppletsEntityProgressions);

  const responseTimes = useAppSelector(selectEntityResponseTimes);

  const { mutateAsync: refresh } = useRefreshMutation();

  const { startFlow, startActivity } = useStartEntity({
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
      getDefaultNotificationRefreshService().refresh(
        queryClient,
        progressions,
        responseTimes,
        LogTrigger.LimitReachedNotification,
      );
    },
    'schedule-event-alert': eventDetail => {
      console.log('[DEBUG] ============ NOTIFICATION TAP HANDLER ============');
      console.log('[DEBUG] Event detail:', JSON.stringify(eventDetail, null, 2));

      const {
        appletId,
        activityId,
        activityFlowId,
        eventId,
        targetSubjectId,
        entityName,
      } = eventDetail.notification.data;

      console.log('[DEBUG] Extracted data:', {
        appletId,
        activityId,
        activityFlowId,
        eventId,
        targetSubjectId,
        entityName,
      });

      const entityId: string = (activityId ?? activityFlowId)!;

      const entityType: EntityType = activityFlowId ? 'flow' : 'regular';

      const executing = getCurrentRoute() === 'InProgressActivity';

      const isAutocompletionWorking = getCurrentRoute() === 'Autocompletion';

      console.log('[DEBUG] Route checks:', {
        currentRoute: getCurrentRoute(),
        executing,
        isAutocompletionWorking,
      });

      getDefaultAnalyticsService().track(MixEvents.NotificationTap, {
        [MixProperties.AppletId]: appletId,
      });

      if (executing) {
        console.log('[DEBUG] Navigating back from in-progress activity');
        navigator.goBack();
      }

      if (isAutocompletionWorking) {
        console.log('[DEBUG] Autocompletion working, ignoring notification');
        getDefaultLogger().log(
          '[useOnNotificationTap]: Notification tap ignored as autocompletion is working (M2-7315)',
        );
        return;
      }

      console.log('[DEBUG] Scheduling startEntity with delay:', executing ? GoBackDuration : WorkaroundDuration);
      setTimeout(
        () => {
          console.log('[DEBUG] ============ STARTING ENTITY ============');
          console.log('[DEBUG] Calling startEntity with:', {
            appletId,
            entityId,
            entityType,
            eventId,
            entityName,
            targetSubjectId,
          });
          startEntity(
            appletId!,
            entityId,
            entityType,
            eventId!,
            entityName!,
            targetSubjectId ?? null,
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
          getDefaultNotificationRefreshService().refresh(
            queryClient,
            progressions,
            responseTimes,
            LogTrigger.ScheduleUpdated,
          );
        })
        .then(() => getDefaultLogger().send());
    },
    'applet-delete-alert': () => {
      navigator.navigate('Applets');

      refresh()
        .then(() => {
          getDefaultNotificationRefreshService().refresh(
            queryClient,
            progressions,
            responseTimes,
            LogTrigger.AppletRemoved,
          );
        })
        .then(() => getDefaultLogger().send());
    },
    'schedule-updated': () => {
      navigator.navigate('Applets');

      refresh()
        .then(() => {
          getDefaultNotificationRefreshService().refresh(
            queryClient,
            progressions,
            responseTimes,
            LogTrigger.AppletUpdated,
          );
        })
        .then(() => getDefaultLogger().send());
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
        getTimeToComplete(
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

    const { data: baseInfo } =
      await getDefaultAppletsService().getAppletBaseInfo({
        appletId,
      });

    const responseTypes = getResponseTypesMap(baseInfo);

    if (entityType === 'flow') {
      const result = await startFlow(
        appletId,
        entityId,
        eventId,
        entityName,
        isTimerElapsed,
        targetSubjectId,
        responseTypes[entityId],
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
        responseTypes[entityId],
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
