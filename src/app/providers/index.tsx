import { FC, Suspense, PropsWithChildren } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import ReactQueryProvider from './ReactQueryProvider';
import ReduxProvider from './ReduxProvider';
import TamaguiProvider from './TamaguiProvider';

export { reduxStore } from './ReduxProvider';

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <TamaguiProvider>
          <NavigationContainer>
            <Suspense>{children}</Suspense>
          </NavigationContainer>
        </TamaguiProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
};

export default AppProvider;
