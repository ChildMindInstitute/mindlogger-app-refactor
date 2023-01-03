import { FC, PropsWithChildren } from 'react';
import { NativeBaseProvider as NativeBaseProviderBase, extendTheme } from 'native-base';

const NativeBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const theme = extendTheme({
    components: {
      Input: {
        variants: {
          underlined: () => {
            return {
              placeholderTextColor: 'light.50',
              color: '#fff',
              borderColor: 'light.50',
              borderBottomWidth: 0.5,
              _focus: {
                borderColor: '#fff',
              },
            };
          },
        },
      },
      Text: {
        baseStyle: {
          color: '#fff',
        },
      },
      Button: {
        variants: {
          solid: () => {
            return {
              bg: '#fff',
              my: 7,
              w: '50%',
              _text: {
                color: 'primary.50',
                fontWeight: 'bold',
              },
            };
          },
        },
      },
    },
    colors: {
      // @todo add all the colors from legacy codebase
      primary: {
        50: '#0067A0',
      },
      light: {
        50: '#ffffff99',
      },
    },
  });

  return <NativeBaseProviderBase theme={theme}>{children}</NativeBaseProviderBase>;
};

export default NativeBaseProvider;
