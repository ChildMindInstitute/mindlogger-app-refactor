import { useCallback, useMemo, useRef } from 'react';
import { ScrollViewProps } from 'react-native';

type IgnorePressOnScrollProps = Pick<
  ScrollViewProps,
  | 'onMomentumScrollBegin'
  | 'onMomentumScrollEnd'
  | 'onScrollBeginDrag'
  | 'onScrollEndDrag'
  | 'onScroll'
>;

// Ignore press on a list item when the list is scrolling (M2-11189):
// - Spread `ignorePressOnScrollProps` onto the list
// - Pass `onCardPressIn` to each list item
// - Skip `onPress` for each list item when `ignorePress.current` is set
export function useIgnorePressOnScroll() {
  // Track whether list is scrolling
  const isScrolling = useRef(false);

  // Track whether press should be ignored
  // - Ignore press if press begins while list is scrolling
  // - Ignore press if scroll occurs after press begins
  const ignorePress = useRef(false);

  const onCardPressIn = useCallback(() => {
    ignorePress.current = isScrolling.current; // Ignore press if press begins while list is scrolling
  }, []);

  const ignorePressOnScrollProps = useMemo<IgnorePressOnScrollProps>(
    () => ({
      onMomentumScrollBegin: () => {
        isScrolling.current = true; // Begin scrolling
        ignorePress.current = true; // Ignore press if scroll occurs after press begins
      },
      onMomentumScrollEnd: () => {
        isScrolling.current = false; // End scrolling
      },
      onScrollBeginDrag: () => {
        isScrolling.current = true; // Begin scrolling
        ignorePress.current = true; // Ignore press if scroll occurs after press begins
      },
      onScrollEndDrag: () => {
        isScrolling.current = false; // End scrolling
      },
      onScroll: () => {
        ignorePress.current = true; // Ignore press if scroll occurs after press begins
      },
    }),
    [],
  );

  return { ignorePress, onCardPressIn, ignorePressOnScrollProps };
}
