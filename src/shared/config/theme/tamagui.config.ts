import { createAnimations } from '@tamagui/animations-react-native';
import { createFont, createTamagui, createTokens } from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';
import { themes as baseThemes, tokens as baseTokens } from '@tamagui/themes';

import { palette } from '@app/shared/lib/constants/palette';

export const defaultFont = createFont({
  family: 'Moderat-Regular',
  size: {},
  lineHeight: {},
  letterSpacing: {},
  weight: {
    1: '400',
    2: '700',
  },
  face: {
    400: { normal: 'Moderat-Regular', italic: 'Moderat-RegularItalic' },
    700: { normal: 'Moderat-Bold', italic: 'Moderat-BoldItalic' },
  },
});

export const elFont = createFont({
  family: 'Lato-Regular',
  size: {},
  lineHeight: {},
  letterSpacing: {},
  weight: {
    1: '400',
    2: '700',
  },
  face: {
    400: { normal: 'Lato-Regular', italic: 'Lato-Italic' },
    700: { normal: 'Lato-Black', italic: 'Lato-BlackItalic' },
  },
});

const codeFont = createFont({
  family: 'Menlo',
  size: {},
  lineHeight: {},
  letterSpacing: {},
  weight: {},
});

const tokens = createTokens({
  ...baseTokens,
  color: palette,
});

const animations = createAnimations({
  fast: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    damping: 20,
    stiffness: 60,
  },
});

export const uiConfig = createTamagui({
  themes: {
    ...baseThemes,
    main: {
      background: tokens.color.primary,
      color: tokens.color.secondary,
    },
  },
  tokens,
  shorthands,
  fonts: {
    body: defaultFont,
    body_el: elFont,
    code: codeFont,
  },
  animations,
});

export type AppConfig = typeof uiConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
