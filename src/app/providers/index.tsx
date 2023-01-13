import { FC, Suspense, PropsWithChildren } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import ReactQueryProvider from './ReactQueryProvider';
import TamaguiProvider from './TamaguiProvider';

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <TamaguiProvider>
        <NavigationContainer>
          <Suspense>{children}</Suspense>
        </NavigationContainer>
      </TamaguiProvider>
    </ReactQueryProvider>
  );
};

export default AppProvider;
