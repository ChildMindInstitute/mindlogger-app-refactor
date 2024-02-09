import { FC, PropsWithChildren } from 'react';

import { NavigationContainer, NavigationState, DefaultTheme } from '@react-navigation/native';
import { ScreensModel, RootStackParamList } from '@screens';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const NavigationProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NavigationContainer
      theme={theme}
      onStateChange={(state) =>
        ScreensModel.onScreenChanged(
          // @react-navigation's poor type inference
          state as NavigationState<RootStackParamList>,
        )
      }
    >
      {children}
    </NavigationContainer>
  );
};

export default NavigationProvider;
