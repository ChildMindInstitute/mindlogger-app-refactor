import { Circle } from 'react-native-progress';

import { colors } from '../lib/constants/colors';

type Props = {
  size?: number;
};

/**
 * An indeterminate spinner component
 * @param size - The size of the spinner, defaults to 40
 * @see https://github.com/oblador/react-native-progress?tab=readme-ov-file#progresscircle
 */
export function Spinner({ size }: Props) {
  return (
    <Circle size={size} color={colors.blue} borderWidth={1} indeterminate />
  );
}
