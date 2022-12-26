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

const NativeBaseProvider = ({ children }) => {
  const theme = extendTheme({
    colors: {
      // Add new color
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
      // Redefining only one shade, rest of the color will remain same.
      amber: {
        400: '#d97706',
      },
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: 'dark',
    },
  });

  return <NativeBaseProviderBase theme={theme}>{children}</NativeBaseProviderBase>;
};

export { NativeBaseProvider };
