import { FC, Suspense, PropsWithChildren } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import CommonEvents from './CommonEvents';
import ReactQueryProvider from './ReactQueryProvider';
import ReduxProvider from './ReduxProvider';
import TamaguiProvider from './TamaguiProvider';

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <TamaguiProvider>
          <NavigationContainer>
            <CommonEvents>
              <Suspense>{children}</Suspense>
            </CommonEvents>
          </NavigationContainer>
        </TamaguiProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
};

export default AppProvider;
