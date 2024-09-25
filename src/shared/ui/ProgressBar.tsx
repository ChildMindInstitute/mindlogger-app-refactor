import { Bar } from 'react-native-progress';

import { colors } from '../lib/constants/colors';

type Props = {
  progress: number;
  height?: number;
};

export function ProgressBar({ progress, height = 10 }: Props) {
  return (
    <Bar
      progress={progress}
      color={colors.blue}
      unfilledColor={colors.grey2}
      borderWidth={0}
      height={height}
      width={null}
    />
  );
}
