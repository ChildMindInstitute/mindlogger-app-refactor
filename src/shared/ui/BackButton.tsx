import { PropsWithChildren } from 'react';
import { TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Box, BoxProps } from './base';

type RootParamList = ReactNavigation.RootParamList;

type Props<RouteName extends keyof RootParamList> =
  undefined extends RootParamList[RouteName]
    ?
        | { fallbackRoute?: RouteName }
        | {
            fallbackRoute: RouteName;
            fallbackParams: RootParamList[RouteName];
          }
    : { fallbackRoute: RouteName; fallbackParams: RootParamList[RouteName] };

export function BackButton<TRouteName extends keyof RootParamList>(
  props: PropsWithChildren<Props<TRouteName>> & BoxProps,
) {
  // fallbackParams is of any type here if we use object destructuring
  // @ts-ignore
  const { children, fallbackRoute, fallbackParams, ...styledProps } = props;
  const navigation = useNavigation();

  const back = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (fallbackRoute) {
      // @react-navigation's poor type inference
      // @ts-ignore
      navigation.navigate(fallbackRoute, fallbackParams);
    }
  };

  return (
    <Box {...styledProps}>
      <TouchableOpacity onPress={back} hitSlop={40}>
        {children}
      </TouchableOpacity>
    </Box>
  );
}
