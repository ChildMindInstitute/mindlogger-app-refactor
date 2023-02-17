import { FC, PropsWithChildren } from 'react';

import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { ScreensModel, RootStackParamList } from '@screens';

const NavigationProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NavigationContainer
      onStateChange={state =>
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
