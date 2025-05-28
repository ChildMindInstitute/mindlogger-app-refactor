import { colors } from '@app/shared/lib/constants/colors';
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
    <OcticonsCircleCheckFill color={colors.alertSuccessIcon} size={26} />
  ),
  error: <MaterialAlertOctagon color={colors.alertErrorIcon} size={26} />,
  warning: <MaterialAlertCircle color={colors.alertWarnIcon} size={26} />,
  info: <MaterialInformation color={colors.alertInfoIcon} size={26} />,
};

export const BANNER_BG_COLORS = {
  success: colors.alertSuccessBg,
  error: colors.alertErrorBg,
  warning: colors.alertWarnBg,
  info: colors.alertInfoBg,
};

export const BANNERS_DEFAULT_BG = colors.primary;
