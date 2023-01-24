import { FC, PropsWithChildren } from 'react';

import { TamaguiProvider } from '@tamagui/core';

import { uiConfig } from '@shared/config';

const UIProvider: FC<PropsWithChildren> = ({ children }) => (
  <TamaguiProvider config={uiConfig}>{children}</TamaguiProvider>
);

export default UIProvider;
