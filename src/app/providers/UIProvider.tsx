import { FC, PropsWithChildren } from 'react';

import { createFont, createTamagui, TamaguiProvider } from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/theme-base';

const defaultFont = createFont({
  family: 'System',
  size: {},
  lineHeight: {},
  letterSpacing: {},
  weight: {},
});

const config = createTamagui({
  themes,
  tokens,
  shorthands,
  fonts: {
    body: defaultFont,
    title: defaultFont,
  },
});

export type AppConfig = typeof config;

declare module '@tamagui/core' {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

const UIProvider: FC<PropsWithChildren> = ({ children }) => (
  <TamaguiProvider config={config}>{children}</TamaguiProvider>
);

export default UIProvider;
