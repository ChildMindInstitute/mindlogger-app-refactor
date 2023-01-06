import { FC, Suspense, PropsWithChildren } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import NativeBaseProvider from './NativeBaseProvider';
import ReactQueryProvider from './ReactQueryProvider';
import TamaguiProvider from './TamaguiProvider';

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <TamaguiProvider>
        <NativeBaseProvider>
          <NavigationContainer>
            <Suspense>{children}</Suspense>
          </NavigationContainer>
        </NativeBaseProvider>
      </TamaguiProvider>
    </ReactQueryProvider>
  );
};

export default AppProvider;
