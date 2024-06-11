import { Bar } from 'react-native-progress';

import { colors } from '../lib';

type Props = {
  progress: number;
  height?: number;
};

function ProgressBar({ progress, height = 10 }: Props) {
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

export default ProgressBar;
