// import { colors } from '../../theme';
import { StyleSheet } from 'react-native';

const colors = {
  primary: '#0067A0',
  secondary: '#FFFFFF',
};

export default StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginTop: 36,
    marginBottom: 16,
    width: 'auto',
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    minWidth: 140,
  },
  buttonText: {
    fontSize: 20,
  },
  text: {
    color: colors.secondary,
    fontSize: 20,
  },
});
