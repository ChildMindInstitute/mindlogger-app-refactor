import { hexToRgba } from '../utils/theme.utils';

export interface Palette {
  [key: string]: string;
}

/**
 * This references all base "primitive" colors.
 * These colors will be used to give values to
 * semantic colors, like "on_container".
 */
const basePalette = {
  primary: '#0B0907',
  primary0: '#000',
  primary10: '#1D1B19',
  primary20: '#32302D',
  primary30: '#484744',
  primary40: '#5F5E5B',
  primary50: '#787773',
  primary60: '#91918E',
  primary70: '#ACABA9',
  primary80: '#C6C6C5',
  primary90: '#E3E2E1',
  primary95: '#F1F0EF',
  primary99: '#FDFCFC',
  primary100: '#FFF',
  secondary: '#004CED',
  secondary0: '#000',
  secondary10: '#041847',
  secondary20: '#182D65',
  secondary30: '#173F9F',
  secondary40: '#004CED',
  secondary50: '#216DFF',
  secondary60: '#3C90FF',
  secondary70: '#55B1FF',
  secondary80: '#8BCEFF',
  secondary90: '#CAE6FF',
  secondary95: '#E5F3FF',
  secondary99: '#FBFCFF',
  secondary100: '#FFF',
  tertiary: '#944262',
  tertiary0: '#000',
  tertiary10: '#320F1D',
  tertiary20: '#4B2432',
  tertiary30: '#6B364A',
  tertiary40: '#944262',
  tertiary50: '#AF5C82',
  tertiary60: '#CA779E',
  tertiary70: '#D69AB8',
  tertiary80: '#E5BCD1',
  tertiary90: '#F0DAE5',
  tertiary95: '#F9EEF4',
  tertiary99: '#FFFBFF',
  tertiary100: '#FFF',
  error: '#BA1A1A',
  error0: '#000',
  error10: '#410002',
  error20: '#690004',
  error30: '#930009',
  error40: '#BA1A1A',
  error50: '#DE3730',
  error60: '#FF5449',
  error70: '#FE897D',
  error80: '#FFB4AB',
  error90: '#FFDAD6',
  error95: '#FFEDEA',
  error99: '#FFFBFF',
  error100: '#FFF',
  neutral: '#5F5E5B',
  neutral0: '#000',
  neutral10: '#1D1B19',
  neutral20: '#32302D',
  neutral30: '#484744',
  neutral40: '#5F5E5B',
  neutral50: '#787773',
  neutral60: '#91918E',
  neutral70: '#ACABA9',
  neutral80: '#C6C6C5',
  neutral90: '#E3E2E1',
  neutral95: '#F1F0EF',
  neutral99: '#FDFCFC',
  neutral100: '#FFF',
  neutral99_and_neutral10_012: '#EDECEC',
  neutral_variant: '#5F5E5B',
  neutral_variant0: '#000',
  neutral_variant10: '#1D1B19',
  neutral_variant20: '#32302D',
  neutral_variant30: '#484744',
  neutral_variant40: '#5F5E5B',
  neutral_variant50: '#787773',
  neutral_variant60: '#91918E',
  neutral_variant70: '#ACABA9',
  neutral_variant80: '#C6C6C5',
  neutral_variant90: '#E3E2E1',
  neutral_variant95: '#F1F0EF',
  neutral_variant99: '#FDFCFC',
  neutral_variant100: '#FFF',
  surface: '#FDFCFC',
  surface1: '#F5F4F4',
  surface2: '#F0EFEF',
  surface3: '#ECEBEA',
  surface4: '#EAE9E9',
  surface5: '#E7E6E5',
  blue: '#0152FD',
  blue_light: '#B3CBFE',
  brown: '#79403C',
  brown_light: '#D6C6C4',
  gray: '#787773',
  gray_light: '#D6D6D5',
  green: '#386348',
  green_light: '#C3D0C8',
  orange: '#E65838',
  orange_light: '#F7CDC3',
  pink: '#A75276',
  pink_light: '#E6CCD7',
  yellow: '#DAB417',
  yellow_light: '#F4E8BA',
  purple: '#6C4E9B',
  purple_light: '#D3CAE1',
  red: '#B83236',
  red_light: '#EAC1C3',
  white: '#FFFFFF',
} as const;

/**
 * This contains all flattened palette colors with its tonal variants,
 * as well as all semantic colors (on_container, container, etc).
 */
export const semanticPalette = {
  success: basePalette.green,
  success_container: basePalette.green_light,
  on_error: basePalette.error40,
  error_container: basePalette.error90,
  on_error_container: basePalette.error10,
  warning: basePalette.yellow,
  warning_container: basePalette.yellow_light,
  info: basePalette.blue,
  info_container: basePalette.blue_light,
  on_surface: basePalette.neutral10,
  inverse_on_surface: basePalette.neutral95,
  surface_variant: basePalette.neutral90,
  on_surface_variant: basePalette.neutral_variant30,
  on_primary: basePalette.primary100,
  on_primary_container: basePalette.primary10,
  outline: basePalette.neutral_variant50,
  outline_variant: basePalette.neutral_variant80,
  secondary_container: basePalette.secondary90,
  on_secondary_container: basePalette.secondary0,
  secondary_fixed_dim: basePalette.secondary80,

  // TODO:
  // Figure out how to test the components that still reference these
  // legacy tokens and replace them with semantic tokens.
  grey: '#808080',
  grey2: '#a0a0a0',
  darkerGrey3: '#7E7E7E',
  darkerGreyBackground: '#7E7E7E80',
  darkerGrey2: '#101010',
} as const;

/**
 * These are alpha variants of the semantic colors.
 * They exist separately from the semantic palette for
 * better maintainability.
 */
const alphaVariantsPalette = {
  white_alpha60: hexToRgba(basePalette.white, 0.6),
  on_surface_alpha12: hexToRgba(basePalette.neutral10, 0.12),
  on_surface_alpha30: hexToRgba(basePalette.neutral10, 0.3),
  toast_container: hexToRgba(basePalette.primary, 0.8),
  spinner_container: hexToRgba(basePalette.surface1, 0.5),
} as const;

export const palette = {
  ...basePalette,
  ...semanticPalette,
  ...alphaVariantsPalette,
} as const satisfies Palette;
