import { FC, useCallback, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';

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

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  if (hasError) {
    return (
      <XStack flex={1} jc="center" ai="center">
        <LoadListError error="widget_error:error_text" />
      </XStack>
    );
  }

  if (isSuccess && !groups?.length) {
    return (
      <XStack flex={1} jc="center" ai="center">
        <NoListItemsYet translationKey="activity_list_component:no_activities_yet" />
      </XStack>
    );
  }

  return (
    <Box {...props}>
      <YStack space={12}>
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
