import { FC, PropsWithChildren } from 'react';

import { TamaguiProvider as CoreTamaguiProvider } from '@tamagui/core';

import { uiConfig } from '@app/shared/config/theme/tamagui.config';

export const TamaguiProvider: FC<PropsWithChildren> = ({ children }) => (
  <CoreTamaguiProvider config={uiConfig}>{children}</CoreTamaguiProvider>
);
