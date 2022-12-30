import { FC, PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from './native-base-provider';

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NavigationContainer>
      <NativeBaseProvider>{children}</NativeBaseProvider>
    </NavigationContainer>
  );
};

export default AppProvider;
