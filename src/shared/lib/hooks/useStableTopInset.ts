import { useWindowDimensions } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Orientation = 'portrait' | 'landscape';

// App-wide cache of the largest top inset observed per orientation. It is
// shared by all consumers so a component that mounts while the status bar is
// hidden (live inset 0) still gets the value captured earlier by components
// that mounted before the hide (e.g. Banners, which mounts at app start).
const maxTopByOrientation: Record<Orientation, number> = {
  portrait: 0,
  landscape: 0,
};

export const resetStableTopInsetCache = (): void => {
  maxTopByOrientation.portrait = 0;
  maxTopByOrientation.landscape = 0;
};

/**
 * Returns the top safe area inset, ignoring transient drops to a smaller
 * value (e.g. when the status bar is hidden during an in-progress activity).
 *
 * Layouts that reserve space for the status bar can use this instead of the
 * live inset so that hiding/showing the status bar does not shift the UI.
 *
 * The remembered value is cached app-wide (per orientation, since portrait
 * insets don't apply to landscape, e.g. when Unity rotates the app), so
 * components that mount while the status bar is already hidden still get the
 * inset captured earlier by components that mounted before the hide.
 */
export const useStableTopInset = (): number => {
  const { top } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const orientation: Orientation = height >= width ? 'portrait' : 'landscape';

  if (top > maxTopByOrientation[orientation]) {
    maxTopByOrientation[orientation] = top;
  }

  return maxTopByOrientation[orientation];
};
