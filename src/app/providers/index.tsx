import { FC, Suspense, PropsWithChildren } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import NativeBaseProvider from './NativeBaseProvider';
import TamaguiProvider from './TamaguiProvider';

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <TamaguiProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <Suspense>{children}</Suspense>
        </NavigationContainer>
      </NativeBaseProvider>
    </TamaguiProvider>
  );
};

export default AppProvider;
