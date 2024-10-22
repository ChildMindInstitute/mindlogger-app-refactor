import React, { FC, useCallback } from 'react';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/core';
import { useQueryClient } from '@tanstack/react-query';

import { AutocompletionEventOptions } from '@app/abstract/lib/types/autocompletion';
import { EntityPath } from '@app/abstract/lib/types/entity';
import { selectAppletsEntityProgressions } from '@app/entities/applet/model/selectors';
import { ConnectionStatusBar } from '@app/features/streaming/ui/ConnectionStatusBar';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import {
  MixEvents,
  MixProperties,
} from '@app/shared/lib/analytics/IAnalyticsService';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { useOnFocus } from '@app/shared/lib/hooks/useOnFocus';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { Box } from '@app/shared/ui/base';
import { HorizontalCalendar } from '@app/shared/ui/HorizontalCalendar';
import { ActivityGroups } from '@app/widgets/activity-group/ui/ActivityGroups';
import { useAutoCompletion } from '@app/widgets/survey/model/hooks/useAutoCompletion';
import { UploadRetryBanner } from '@app/widgets/survey/ui/UploadRetryBanner';

import { AppletDetailsParamList } from '../config/types';
import { checkEntityAvailability } from '../model/checkEntityAvailability';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'ActivityList'>;

export const ActivityListScreen: FC<Props> = props => {
  const appletId = props.route.params.appletId;

  const isFocused = useIsFocused();

  useOnFocus(() => {
    getDefaultAnalyticsService().track(MixEvents.AppletView, {
      [MixProperties.AppletId]: appletId,
    });
  });

  const entityProgressions = useAppSelector(selectAppletsEntityProgressions);

  const queryClient = useQueryClient();

  const checkAvailability = useCallback(
    async (
      entityName: string,
      { eventId, entityId, entityType, targetSubjectId }: EntityPath,
    ) => {
      const isSuccess = await checkEntityAvailability({
        entityName,
        identifiers: {
          appletId,
          eventId,
          entityId,
          entityType,
          targetSubjectId,
        },
        queryClient,
        entityProgressions,
      });

      if (!isSuccess) {
        Emitter.emit<AutocompletionEventOptions>('autocomplete', {
          checksToExclude: ['start-entity'],
          logTrigger: 'check-availability',
        });
      }
      return isSuccess;
    },
    [appletId, entityProgressions, queryClient],
  );

  const { completeEntityIntoUploadToQueue } = useAutoCompletion();

  return (
    <Box flex={1}>
      <UploadRetryBanner accessibilityLabel="upload-banner" />
      <HorizontalCalendar mt={8} />
      <ConnectionStatusBar appletId={appletId} mb={20} />

      {isFocused && (
        <ActivityGroups
          flex={1}
          px={14}
          appletId={appletId}
          completeEntity={completeEntityIntoUploadToQueue}
          checkAvailability={checkAvailability}
        />
      )}
    </Box>
  );
};
