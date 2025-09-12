import { FC, useMemo } from 'react';

import { useIsFetching } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  CheckAvailability,
  CompleteEntityIntoUploadToQueue,
} from '@app/abstract/lib/types/entity';
import { getAppletCompletedEntitiesKey } from '@app/shared/lib/utils/reactQueryHelpers';
import { Box, BoxProps, XStack, YStack } from '@app/shared/ui/base';
import { ChecklistIcon } from '@app/shared/ui/icons/ChecklistIcon';
import { LoadListError } from '@app/shared/ui/LoadListError';
import { Spinner } from '@app/shared/ui/Spinner';

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

  return (
    <>
      {hasError ? (
        <XStack
          aria-label="activity-group-error"
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
      ) : (
        <Box {...props}>
          <YStack aria-label="activity-group-list" flex={1}>
            {renderedGroups && responseTypes
              ? (() => {
                  // Filter out activities without valid responseTypes to ensure consistency
                  const validGroups = renderedGroups
                    .map(group => ({
                      ...group,
                      activities: group.activities.filter(activity => {
                        const entityId = activity.flowId || activity.activityId;
                        const types = responseTypes?.[entityId];
                        // Only include activities with valid, non-empty responseTypes
                        return (
                          types &&
                          Array.isArray(types) &&
                          types.length > 0 &&
                          types.every(Boolean)
                        );
                      }),
                    }))
                    .filter(
                      group => group.activities.length > 0 || group.type === 0,
                    ); // Keep Available group even if empty

                  return validGroups.length > 0 ? (
                    <ActivitySectionList
                      activityResponseTypes={responseTypes}
                      appletId={props.appletId}
                      groups={validGroups}
                      completeEntity={props.completeEntity}
                      checkAvailability={props.checkAvailability}
                    />
                  ) : (
                    <EmptyState
                      aria-label="activity-group-empty"
                      flex={1}
                      icon={<ChecklistIcon />}
                      description={t('activity_list_component:no_activities')}
                    />
                  );
                })()
              : !isLoading && (
                  <EmptyState
                    aria-label="activity-group-empty"
                    flex={1}
                    icon={<ChecklistIcon />}
                    description={t('activity_list_component:no_activities')}
                  />
                )}
          </YStack>
        </Box>
      )}

      <Spinner
        withOverlay
        isVisible={isLoadingCompletedEntities || isLoading}
      />
    </>
  );
};
