import { createAnimations } from '@tamagui/animations-react-native';
import {
  createFont,
  createTamagui,
  createTheme,
  createTokens,
} from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';
import { themes as baseThemes, tokens as baseTokens } from '@tamagui/themes';

import { IS_IOS } from '@app/shared/lib/constants';
import { colors } from '@app/shared/lib/constants/colors';

const defaultFont = createFont({
  family: IS_IOS ? 'Avenir' : 'Roboto',
  size: {},
  lineHeight: {},
  letterSpacing: {},
  weight: {},
});

const elFont = createFont({
  family: 'Lato-Regular',
  size: {},
  lineHeight: {},
  letterSpacing: {},
  weight: {},
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
  color: colors,
});

const main = createTheme({
  background: tokens.color.primary,
  color: tokens.color.secondary,
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
    main,
  },
  tokens,
  shorthands,
  fonts: {
    body: defaultFont,
    body_el: elFont,
    title: defaultFont,
    code: codeFont,
  },
  animations,
});

export type AppConfig = typeof uiConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
