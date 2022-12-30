import { FC, PropsWithChildren } from 'react';
import { NativeBaseProvider as NativeBaseProviderBase, extendTheme } from 'native-base';

export const colors = {
  primary: '#0067A0',
  secondary: '#FFFFFF',
  secondary_50: 'rgba(255, 255, 255, 0.5)',
  tertiary: '#404040',
  grey: '#808080',
  mediumGrey: '#B6B6B6',
  lightGrey: '#F0F0F0',
  alert: 'rgb(230, 50, 50)',
  blue: '#005fa3',
  lightBlue: '#dbf2ff',
  yellow: '#FFBD32',
};

const NativeBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const theme = extendTheme({
    components: {
      Input: {
        variants: {
          underlined: () => {
            return {
              placeholderTextColor: 'rgba(255,255,255,0.6)',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.6)',
              borderBottomWidth: 0.5,
              _focus: {
                borderColor: 'white',
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
      primary: {
        50: '#0067A0',
        100: '#C5E4F3',
        200: '#A2D4EC',
        300: '#7AC1E4',
        400: '#47A9DA',
        500: '#0088CC',
        600: '#007AB8',
        700: '#006BA1',
        800: '#005885',
        900: '#003F5E',
      },
      amber: {
        400: '#d97706',
      },
    },
  });

  return <NativeBaseProviderBase theme={theme}>{children}</NativeBaseProviderBase>;
};

export { NativeBaseProvider };
