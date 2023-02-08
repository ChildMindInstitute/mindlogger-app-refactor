import {
  createFont,
  createTokens,
  createTamagui,
  createTheme,
} from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';
import {
  themes as baseThemes,
  tokens as baseTokens,
} from '@tamagui/theme-base';

import { colors, IS_IOS } from '@app/shared/lib';

const defaultFont = createFont({
  family: IS_IOS ? 'Avenir' : 'Roboto',
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

export const uiConfig = createTamagui({
  themes: {
    ...baseThemes,
    main,
  },
  tokens,
  shorthands,
  fonts: {
    body: defaultFont,
    title: defaultFont,
  },
});

export type AppConfig = typeof uiConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
