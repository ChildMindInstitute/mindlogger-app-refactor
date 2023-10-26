import { FC, memo, useCallback } from 'react';
import {
  FlatList,
  ListRenderItem,
  ScrollViewProps,
  StyleSheet,
} from 'react-native';

import { XStack, YStack } from '@tamagui/stacks';
import { useIsMutating } from '@tanstack/react-query';

import { useOnMutationCacheChange } from '@app/shared/api';
import { Box, BoxProps, NoListItemsYet } from '@app/shared/ui';
import { LoadListError } from '@app/shared/ui';

import AppletCard from './AppletCard';
import { useAppletsQuery } from '../api';
import { Applet } from '../lib';
import { mapApplets } from '../model';

type SelectedApplet = {
  id: string;
  displayName: string;
};

type Props = {
  onAppletPress: (applet: SelectedApplet) => void;
  refreshControl: ScrollViewProps['refreshControl'];
  ListFooterComponent: JSX.Element;
} & BoxProps;

const AppletList: FC<Props> = ({
  onAppletPress,
  refreshControl,
  ListFooterComponent,
  ...styledProps
}) => {
  const { error: getAppletsError, data: applets } = useAppletsQuery({
    select: response => mapApplets(response.data.result),
  });

  const isRefreshing = useIsMutating(['refresh']);

  const refreshError = useOnMutationCacheChange();

  const hasError = !!refreshError || !!getAppletsError;

  const renderItem: ListRenderItem<Applet> = useCallback(
    ({ item }) => (
      <AppletCard
        applet={item}
        disabled={!!isRefreshing}
        onPress={() =>
          onAppletPress({ id: item.id, displayName: item.displayName })
        }
      />
    ),
    [isRefreshing, onAppletPress],
  );

  if (hasError) {
    return (
      <XStack flex={1} jc="center" ai="center">
        <LoadListError error="widget_error:error_text" />
      </XStack>
    );
  }

  if (!isRefreshing && !applets?.length) {
    return (
      <XStack flex={1} jc="center" ai="center">
        <NoListItemsYet translationKey="applet_list_component:no_applets_yet" />
      </XStack>
    );
  }

  return (
    <Box {...styledProps}>
      <FlatList
        contentContainerStyle={styles.flatList}
        data={applets}
        keyExtractor={getId}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={ListFooterComponent}
        ListFooterComponentStyle={styles.listFooterComponent}
        refreshControl={refreshControl}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={12}
      />
    </Box>
  );
};

const Separator = () => <YStack my={9} />;

type IdentifiedObject = {
  id: string;
};

const getId = (item: IdentifiedObject) => item.id;

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 1,
  },
  listFooterComponent: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 28,
  },
});

export default memo(AppletList);
