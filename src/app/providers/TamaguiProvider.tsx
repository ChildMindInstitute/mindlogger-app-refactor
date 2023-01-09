import { FC, PropsWithChildren } from 'react';

import { TamaguiProvider } from '@tamagui/core';

import { appConfig } from '../theme';

const UIProvider: FC<PropsWithChildren> = ({ children }) => (
  <TamaguiProvider config={appConfig}>{children}</TamaguiProvider>
);

export default UIProvider;
