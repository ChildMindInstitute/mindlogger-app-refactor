import {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDebounce } from 'use-debounce';

import { Box } from './base';
import { ScrollButton } from './ScrollButton';
import { IS_SMALL_SIZE_SCREEN } from '../lib/constants';
import { ScrollViewContext } from '../lib/contexts/ScrollViewContext';

type Props = {
  scrollEnabled?: boolean;
  scrollEventThrottle?: number;
} & PropsWithChildren;

const PaddingToBottom = IS_SMALL_SIZE_SCREEN ? 30 : 40;

export const ScrollableContent: FC<Props> = ({
  children,
  scrollEnabled = true,
  scrollEventThrottle = 100,
}: Props) => {
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [isAreaScrollable, setAreaScrollable] = useState<boolean>(false);

  const [scrollContentHeight, setScrollContentHeight] = useState<number | null>(
    null,
  );

  const [debouncedScrollContentHeight] = useDebounce(scrollContentHeight, 300);

  const [endOfContentReachedOnce, setEndOfContentReachedOnce] = useState(false);

  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollViewRef = useRef<ScrollView>();

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (endOfContentReachedOnce) {
      return;
    }

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const endReached =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - PaddingToBottom;

    if (endReached) {
      setShowScrollButton(false);
      setEndOfContentReachedOnce(true);
    }
  };

  function scrollToEnd() {
    scrollViewRef.current?.scrollToEnd();
    setShowScrollButton(false);
    setEndOfContentReachedOnce(true);
  }

  function setScrollEnabled(value: boolean) {
    scrollViewRef.current?.setNativeProps({
      scrollEnabled: value,
    });
  }

  const context = useMemo(
    () => ({ scrollToEnd, isAreaScrollable, setScrollEnabled }),
    [isAreaScrollable],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponderCapture: () => false,
        onShouldBlockNativeResponder: () => false,
        onPanResponderTerminationRequest: () => false,
      }),
    [],
  );

  useEffect(() => {
    if (!containerHeight || !debouncedScrollContentHeight) {
      return;
    }

    if (debouncedScrollContentHeight - PaddingToBottom > containerHeight) {
      setShowScrollButton(true);
      setAreaScrollable(true);
    }
  }, [containerHeight, debouncedScrollContentHeight]);

  return (
    <ScrollViewContext.Provider value={context}>
      <Box
        flex={1}
        onLayout={e => {
          setContainerHeight(e.nativeEvent.layout.height);
        }}
      >
        <Box flex={1}>
          <KeyboardAwareScrollView
            innerRef={ref => {
              scrollViewRef.current = ref as unknown as ScrollView;
            }}
            contentContainerStyle={styles.scrollView}
            onContentSizeChange={(_, contentHeight) => {
              setScrollContentHeight(contentHeight);
            }}
            scrollEnabled={scrollEnabled}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardOpeningTime={0}
            scrollEventThrottle={scrollEventThrottle}
            onScroll={onScroll}
            overScrollMode="never"
            alwaysBounceVertical={false}
            bounces={false}
            {...panResponder.panHandlers}
          >
            {children}
          </KeyboardAwareScrollView>
        </Box>

        {showScrollButton && (
          <ScrollButton
            onPress={scrollToEnd}
            position="absolute"
            bottom={7}
            alignSelf="center"
          />
        )}
      </Box>
    </ScrollViewContext.Provider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});
