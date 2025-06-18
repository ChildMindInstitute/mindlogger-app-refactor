import { Bar } from 'react-native-progress';

import { palette } from '../lib/constants/palette';

type Props = {
  progress: number;
  height?: number;
};

export function ProgressBar({ progress, height = 10 }: Props) {
  return (
    <Bar
      progress={progress}
      color={palette.blue}
      unfilledColor={palette.grey2}
      borderWidth={0}
      height={height}
      width={null}
    />
  );
}
