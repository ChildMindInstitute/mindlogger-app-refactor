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
  success: (
    <OcticonsCircleCheckFill color={palette.alertSuccessIcon} size={26} />
  ),
  error: <MaterialAlertOctagon color={palette.alertErrorIcon} size={26} />,
  warning: <MaterialAlertCircle color={palette.alertWarnIcon} size={26} />,
  info: <MaterialInformation color={palette.alertInfoIcon} size={26} />,
};

export const BANNER_BG_COLORS = {
  success: palette.alertSuccessBg,
  error: palette.alertErrorBg,
  warning: palette.alertWarnBg,
  info: palette.alertInfoBg,
};

export const BANNERS_DEFAULT_BG = palette.surface;
