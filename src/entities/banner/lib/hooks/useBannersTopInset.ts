import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { useStableTopInset } from '@app/shared/lib/hooks/useStableTopInset';

import { bannersReserveStatusBarSelector } from '../../model/selectors';

/**
 * Top inset reserved by the banners strip above the app.
 *
 * Outside activities, and during transitions in and out of activities, reserve
 * stable inset defined by the device in the current orientation (status bar or
 * notch).
 *
 * Inside activities, after transitions end, reserve live inset with status bar
 * hidden:
 *
 * - Android with camera cutout: top inset remains (cutout height)
 * - Android without camera cutout: top inset reduced to 0
 * - iPhone with notch: top inset remains (notch height)
 * - iPad or iPhone with home button: top inset reduced to 0
 *
 * The activity gets to use the space previously occupied by the status bar for
 * layout of activity content (M2-11193).
 *
 * (Unity activities are the exception: top inset reduced to 0 on all devices.)
 */
export const useBannersTopInset = (): number => {
  const reserveStatusBar = useAppSelector(bannersReserveStatusBarSelector);
  const stableTop = useStableTopInset();
  const { top: liveTop } = useSafeAreaInsets();

  return reserveStatusBar ? stableTop : liveTop;
};
