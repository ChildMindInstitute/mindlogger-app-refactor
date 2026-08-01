import { useRef } from 'react';
import { useWindowDimensions } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Returns the top safe area inset, ignoring transient drops to a smaller
 * value (e.g. when the status bar is hidden during an in-progress activity).
 *
 * Layouts that reserve space for the status bar can use this instead of the
 * live inset so that hiding/showing the status bar does not shift the UI.
 *
 * The remembered value is only valid within one orientation (portrait insets
 * don't apply to landscape, e.g. when Unity rotates the app), so it resets to
 * the live inset whenever the orientation changes. Rotation re-lays out the
 * whole screen anyway, so that change is not visible as a shift.
 */
export const useStableTopInset = (): number => {
  const { top } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const maxTop = useRef(top);
  const wasPortrait = useRef(isPortrait);

  if (isPortrait !== wasPortrait.current) {
    wasPortrait.current = isPortrait;
    maxTop.current = top;
  } else if (top > maxTop.current) {
    maxTop.current = top;
  }

  return maxTop.current;
};
