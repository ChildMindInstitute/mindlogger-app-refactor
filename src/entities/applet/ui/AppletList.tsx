import { FC, memo, useCallback } from 'react';
import {
  FlatList,
  ListRenderItem,
  ScrollViewProps,
  StyleSheet,
} from 'react-native';

import { XStack, YStack } from '@tamagui/stacks';
import { useIsMutating } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOnMutationCacheChange } from '@app/shared/api/hooks/useOnMutationCacheChange';
import { useUploadObservable } from '@app/shared/lib/hooks/useUploadObservable';
import { Box, BoxProps } from '@app/shared/ui/base';
import { GradientOverlay } from '@app/shared/ui/GradientOverlay';
import { LoadListError } from '@app/shared/ui/LoadListError';
import { NoListItemsYet } from '@app/shared/ui/NoListItemsYet';

import { AppletCard } from './AppletCard';
import { useAppletsQuery } from '../api/hooks/useAppletsQuery';
import { Applet } from '../lib/types';
import { mapApplets } from '../model/mappers';

type SelectedApplet = {
  id: string;
  displayName: string;
};

type Props = {
  onAppletPress: (applet: SelectedApplet) => void;
  refreshControl: ScrollViewProps['refreshControl'];
  ListFooterComponent: JSX.Element;
} & BoxProps;

const THUMBNAIL_BG_COLORS = [
  '$pink',
  '$blue',
  '$green',
  '$yellow',
  '$brown',
  '$purple',
  '$orange',
];

const AppletListView: FC<Props> = ({
  onAppletPress,
  refreshControl,
  ListFooterComponent,
  ...styledProps
}) => {
  const { error: getAppletsError, data: applets } = useAppletsQuery({
    select: response => mapApplets(response.data.result),
  });
  const { bottom } = useSafeAreaInsets();

  const isRefreshing = useIsMutating(['refresh']);

  const { isUploading } = useUploadObservable();

  const refreshError = useOnMutationCacheChange();

  const hasError = !!refreshError || !!getAppletsError;

  const renderItem: ListRenderItem<Applet> = useCallback(
    ({ item, index }) => (
      <AppletCard
        accessibilityLabel={`applet-${item.displayName}`}
        applet={item}
        disabled={!!isRefreshing || isUploading}
        onPress={() =>
          onAppletPress({ id: item.id, displayName: item.displayName })
        }
        thumbnailColor={THUMBNAIL_BG_COLORS[index % THUMBNAIL_BG_COLORS.length]}
      />
    ),
    [isRefreshing, isUploading, onAppletPress],
  );

  if (hasError) {
    return (
      <XStack flex={1} jc="center" ai="center">
        <LoadListError error="widget_error:error_text" />
      </XStack>
    );
  }

  return (
    <Box {...styledProps}>
      <FlatList
        contentContainerStyle={[styles.flatList, { paddingBottom: bottom }]}
        accessibilityLabel="applet-list"
        data={applets ?? []}
        keyExtractor={getId}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={ListFooterComponent}
        ListFooterComponentStyle={styles.listFooterComponent}
        refreshControl={refreshControl}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={12}
        ListEmptyComponent={
          !isRefreshing ? (
            <YStack flex={1} jc="flex-end" ai="center">
              <NoListItemsYet translationKey="applet_list_component:no_applets_yet" />
            </YStack>
          ) : (
            <></>
          )
        }
      />
      <GradientOverlay />
    </Box>
  );
};

const Separator = () => <YStack my={8} />;

type IdentifiedObject = {
  id: string;
};

const getId = (item: IdentifiedObject) => item.id;

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  listFooterComponent: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 28,
  },
});

export const AppletList = memo(AppletListView);
