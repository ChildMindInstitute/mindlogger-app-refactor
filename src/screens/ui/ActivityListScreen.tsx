import { FC, useCallback } from 'react';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/core';
import { useQueryClient } from '@tanstack/react-query';

import { EntityPath, StoreProgress } from '@app/abstract/lib';
import {
  SharedContentConsent,
  useAppletDetailsQuery,
} from '@app/entities/applet';
import { AppletModel } from '@app/entities/applet';
import { mapAppletDetailsFromDto } from '@app/entities/applet/model';
import {
  AnalyticsService,
  Emitter,
  MixEvents,
  MixProperties,
  useAppSelector,
  useFeatureFlags,
  useOnFocus,
} from '@app/shared/lib';
import { ActivityGroups } from '@app/widgets/activity-group';
import { SurveyModel, UploadRetryBanner } from '@app/widgets/survey';
import { StreamingStatusBar } from '@features/streaming';
import { AppletDetailsParamList } from '@screens/config';
import { Box, HorizontalCalendar } from '@shared/ui';

import { checkEntityAvailability } from '../model/checkEntityAvailability';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'ActivityList'>;

const ActivityListScreen: FC<Props> = props => {
  const appletId = props.route.params.appletId;

  const { featureFlags } = useFeatureFlags();

  const { data: consentsCapabilityEnabled } = useAppletDetailsQuery(appletId, {
    select: response =>
      mapAppletDetailsFromDto(response.data.result).consentsCapabilityEnabled &&
      (featureFlags.enableConsentsCapability as boolean),
  });

  const isFocused = useIsFocused();

  useOnFocus(() => {
    AnalyticsService.track(MixEvents.AppletView, {
      [MixProperties.AppletId]: appletId,
    });
  });

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const queryClient = useQueryClient();

  const checkAvailability = useCallback(
    (entityName: string, { eventId, entityId, entityType }: EntityPath) => {
      return checkEntityAvailability({
        entityName,
        identifiers: { appletId, eventId, entityId, entityType },
        queryClient,
        storeProgress,
        alertCallback: () => Emitter.emit('autocomplete'),
      });
    },
    [appletId, queryClient, storeProgress],
  );

  const { completeEntityIntoUploadToQueue } = SurveyModel.useAutoCompletion();

  return (
    <Box flex={1}>
      <UploadRetryBanner accessibilityLabel="upload-banner" />
      <HorizontalCalendar mt={8} />
      <StreamingStatusBar appletId={appletId} mb={20} />

      {consentsCapabilityEnabled && (
        <SharedContentConsent appletId={appletId} px={14} mt={10} />
      )}

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

export default ActivityListScreen;
