import { FC, PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import NativeBaseProvider from './NativeBaseProvider';

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>{children}</NavigationContainer>
    </NativeBaseProvider>
  );
};

export default AppProvider;
