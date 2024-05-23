import { FC } from 'react';

import { useIsFetching } from '@tanstack/react-query';

import {
  CheckAvailability,
  CompleteEntityIntoUploadToQueue,
  ProcessAutocompletion,
} from '@app/abstract/lib';
import { getAppletCompletedEntitiesKey } from '@app/shared/lib';
import {
  Box,
  BoxProps,
  YStack,
  ActivityIndicator,
  XStack,
  NoListItemsYet,
  LoadListError,
} from '@app/shared/ui';

import ActivitySectionList from './ActivitySectionList';
import { useActivityGroups } from '../model';

type Props = {
  appletId: string;
  completeEntity: CompleteEntityIntoUploadToQueue;
  processAutocompletion: ProcessAutocompletion;
  checkAvailability: CheckAvailability;
} & BoxProps;

const ActivityGroups: FC<Props> = props => {
  const isLoadingCompletedEntities =
    useIsFetching({
      exact: true,
      queryKey: getAppletCompletedEntitiesKey(props.appletId),
    }) > 0;

  const { groups, isSuccess, error } = useActivityGroups(props.appletId);

  const hasError = !isSuccess;

  if (isLoadingCompletedEntities) {
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

  if (isSuccess && !groups?.length) {
    return (
      <XStack
        accessibilityLabel="activity-group-empty"
        flex={1}
        jc="center"
        ai="center"
      >
        <NoListItemsYet translationKey="activity_list_component:no_activities_yet" />
      </XStack>
    );
  }

  return (
    <Box {...props}>
      <YStack accessibilityLabel="activity-group-list" flex={1}>
        <ActivitySectionList
          appletId={props.appletId}
          groups={groups}
          completeEntity={props.completeEntity}
          processAutocompletion={props.processAutocompletion}
          checkAvailability={props.checkAvailability}
        />
      </YStack>
    </Box>
  );
};

export default ActivityGroups;
