import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Box, KeyboardAvoidingView, ScrollButton } from '@app/shared/ui';

import { IS_ANDROID, IS_IOS } from '../lib';

const ContentInsetVertical = IS_ANDROID ? 0 : 60;

const ScrollButtonRefreshTimeout = 300;

type Props = {
  scrollEnabled: boolean;
} & PropsWithChildren;

const ScrollableContent: FC<Props> = ({ children, scrollEnabled }: Props) => {
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const [scrollContentHeight, setScrollContentHeight] = useState<number | null>(
    null,
  );

  const [endOfContentAchievedOnce, setEndOfContentAchievedOnce] =
    useState(false);

  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollButtonTimeoutId = useRef<number | undefined>(undefined);

  const scrollViewRef = useRef<KeyboardAwareScrollView>();

  useEffect(() => {
    if (!containerHeight || !scrollContentHeight) {
      return;
    }

    if (scrollContentHeight > containerHeight && !endOfContentAchievedOnce) {
      scrollButtonTimeoutId.current = setTimeout(() => {
        setShowScrollButton(true);
      }, ScrollButtonRefreshTimeout);
    } else {
      clearTimeout(scrollButtonTimeoutId.current);
      scrollButtonTimeoutId.current = undefined;

      setShowScrollButton(false);
    }
  }, [containerHeight, scrollContentHeight, endOfContentAchievedOnce]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const achieved =
      Math.round(layoutMeasurement.height + contentOffset.y) >=
      Math.round(contentSize.height + ContentInsetVertical);

    if (!endOfContentAchievedOnce && achieved) {
      setEndOfContentAchievedOnce(achieved);
    }
  };

  function scrollToEnd() {
    scrollViewRef.current?.scrollToEnd();
    setShowScrollButton(false);
  }

  return (
    <Box
      flex={1}
      onLayout={e => {
        setContainerHeight(e.nativeEvent.layout.height);
      }}
    >
      <KeyboardAvoidingView flex={1} behavior={IS_IOS ? 'padding' : 'height'}>
        <Box flex={1}>
          <KeyboardAwareScrollView
            innerRef={ref => {
              scrollViewRef.current = ref as unknown as KeyboardAwareScrollView;
            }}
            contentContainerStyle={styles.scrollView}
            onContentSizeChange={(_, contentHeight) => {
              setScrollContentHeight(contentHeight);
            }}
            scrollEnabled={scrollEnabled}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardOpeningTime={0}
            contentInset={{ top: 0, bottom: ContentInsetVertical }}
            enableOnAndroid
            onScroll={onScroll}
            scrollEventThrottle={50}
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
      </KeyboardAvoidingView>
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default ScrollableContent;
