import { FC, useMemo } from 'react';

import { useIsFetching } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  CheckAvailability,
  CompleteEntityIntoUploadToQueue,
} from '@app/abstract/lib/types/entity';
import { getAppletCompletedEntitiesKey } from '@app/shared/lib/utils/reactQueryHelpers';
import { ActivityIndicator } from '@app/shared/ui/ActivityIndicator';
import { Box, BoxProps, XStack, YStack } from '@app/shared/ui/base';
import { ChecklistIcon } from '@app/shared/ui/icons/ChecklistIcon';
import { LoadListError } from '@app/shared/ui/LoadListError';

import { ActivitySectionList } from './ActivitySectionList';
import { EmptyState } from './EmptyState';
import { ActivityGroupType } from '../lib/types/activityGroup';
import { useActivityGroups } from '../model/hooks/useActivityGroups';
import { useBaseInfo } from '../model/hooks/useBaseInfo';

type Props = {
  appletId: string;
  completeEntity: CompleteEntityIntoUploadToQueue;
  checkAvailability: CheckAvailability;
} & BoxProps;

export const ActivityGroups: FC<Props> = props => {
  const { t } = useTranslation();

  const isLoadingCompletedEntities =
    useIsFetching({
      exact: true,
      queryKey: getAppletCompletedEntitiesKey(props.appletId),
    }) > 0;

  const { groups, isSuccess, error } = useActivityGroups(props.appletId);
  const { data, isLoading, error: baseInfoError } = useBaseInfo(props.appletId);
  const { responseTypes } = data || {};
  const hasError = !isSuccess || !!baseInfoError;

  const renderedGroups = useMemo(() => {
    const hasActivities = groups.some(g => g.activities.length);

    if (hasActivities) {
      // Only show empty available group if there are no in-progress activities
      const showAvailableGroup = !groups.some(
        g => g.type === ActivityGroupType.InProgress && g.activities.length,
      );

      // Filter out empty groups, but show the available group based on above logic
      return groups.filter(
        g =>
          g.activities.length ||
          (g.type === ActivityGroupType.Available && showAvailableGroup),
      );
    } else {
      return null;
    }
  }, [groups]);

  if (isLoadingCompletedEntities || isLoading) {
    return (
      <Box
        accessibilityLabel="activity-group-loader"
        flex={1}
        justifyContent="center"
      >
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  if (hasError) {
    return (
      <XStack
        accessibilityLabel="activity-group-error"
        flex={1}
        jc="center"
        ai="center"
      >
        <LoadListError
          paddingHorizontal="10%"
          textAlign="center"
          error={!error ? 'widget_error:error_text' : error}
        />
      </XStack>
    );
  }

  return (
    <Box {...props}>
      <YStack accessibilityLabel="activity-group-list" flex={1}>
        {renderedGroups ? (
          <ActivitySectionList
            activityResponseTypes={responseTypes}
            appletId={props.appletId}
            groups={renderedGroups}
            completeEntity={props.completeEntity}
            checkAvailability={props.checkAvailability}
          />
        ) : (
          <EmptyState
            accessibilityLabel="activity-group-empty"
            flex={1}
            icon={<ChecklistIcon />}
            description={t('activity_list_component:no_activities')}
          />
        )}
      </YStack>
    </Box>
  );
};
