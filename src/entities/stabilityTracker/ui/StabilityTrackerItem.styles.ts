import { StyleSheet } from 'react-native';

const colors = {
  gray: '#5A5A5A',
  playGroundBackground: 'rgb(150, 150, 150)',
  outerCircleInactiveMargin: 'blue',
  outerCircleActiveMargin: 'rgb(177, 156, 135)',
  outerCircleBorder: 'black',
  innerCircleInactiveMargin: 'blue',
  innerCircleActiveMargin: 'rgb(126, 175, 156)',
  innerCircleBorder: 'black',
  targetPointColor: 'rgb(19,91,89)',
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  times: {
    flex: 1,
    textAlign: 'left',
    transform: [{ rotate: '90deg' }],
  },
  score: {
    flex: 1,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 20,
    transform: [{ rotate: '90deg' }, { translateX: 15 }],
  },
  lambda: {
    flex: 1,
    textAlign: 'left',
    transform: [{ rotate: '90deg' }],
  },
  controlBarWrapper: {
    position: 'absolute',
    width: '10%',
    borderWidth: 2,
    borderColor: colors.gray,
    left: 10,
    backgroundColor: 'white',
  },
  controlBarMask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
});

export { colors };
export default styles;
