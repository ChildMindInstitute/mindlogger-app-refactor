import { FC, useCallback, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { useIsFetching } from '@tanstack/react-query';

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

import ActivityGroup from './ActivityGroup';
import { useActivityGroups } from '../model';

type Props = {
  appletId: string;
} & BoxProps;

const ActivityGroupList: FC<Props> = props => {
  const isLoadingCompletedEntities =
    useIsFetching({
      exact: true,
      queryKey: getAppletCompletedEntitiesKey(props.appletId),
    }) > 0;

  let { groups, isSuccess, isLoading, error } = useActivityGroups(
    props.appletId,
  );
  const [shouldShowList, setShouldShowList] = useState(true);

  const hasError = !!error;

  useFocusEffect(
    useCallback(() => {
      setShouldShowList(true);

      return () => {
        setTimeout(() => setShouldShowList(false), 300);
      };
    }, []),
  );

  if (!shouldShowList) {
    return null;
  }

  if (isLoading || isLoadingCompletedEntities) {
    return (
      <Box data-test="activity-group-loader" flex={1} justifyContent="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  if (hasError) {
    return (
      <XStack data-test="activity-group-error" flex={1} jc="center" ai="center">
        <LoadListError error="widget_error:error_text" />
      </XStack>
    );
  }

  if (isSuccess && !groups?.length) {
    return (
      <XStack data-test="activity-group-empty" flex={1} jc="center" ai="center">
        <NoListItemsYet translationKey="activity_list_component:no_activities_yet" />
      </XStack>
    );
  }

  return (
    <Box {...props}>
      <YStack data-test="activity-group-list" space={12}>
        {groups
          ?.filter(g => g.activities.length)
          .map(g => (
            <ActivityGroup group={g} key={g.name} appletId={props.appletId} />
          ))}
      </YStack>
    </Box>
  );
};

export default ActivityGroupList;
