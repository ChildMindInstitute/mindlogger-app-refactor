import { FC, Suspense, PropsWithChildren } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import NativeBaseProvider from './NativeBaseProvider';
import UIProvider from './UIProvider';

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <UIProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <Suspense>{children}</Suspense>
        </NavigationContainer>
      </NativeBaseProvider>
    </UIProvider>
  );
};

export default AppProvider;
