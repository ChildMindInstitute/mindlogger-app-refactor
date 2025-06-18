import { palette } from '@app/shared/lib/constants/palette';
import {
  MaterialAlertCircle,
  MaterialAlertOctagon,
  MaterialInformation,
  OcticonsCircleCheckFill,
} from '@app/shared/ui/icons';

export const BANNERS = [
  'SuccessBanner',
  'ErrorBanner',
  'WarningBanner',
  'InfoBanner',
  'BrandUpdateBanner',
] as const;

export const BANNER_ICONS = {
  success: <OcticonsCircleCheckFill color={palette.success} size={26} />,
  error: <MaterialAlertOctagon color={palette.error} size={26} />,
  warning: <MaterialAlertCircle color={palette.warning} size={26} />,
  info: <MaterialInformation color={palette.info} size={26} />,
};

export const BANNER_BG_COLORS = {
  success: palette.success_container,
  error: palette.error_container,
  warning: palette.warning_container,
  info: palette.info_container,
};

export const DEFAULT_BG = palette.surface;
