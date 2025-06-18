import { Bar } from 'react-native-progress';

import { palette } from '../lib/constants/palette';

type Props = {
  progress: number;
};

export function HeaderProgressBar({ progress }: Props) {
  return (
    <Bar
      progress={progress}
      color={palette.blue}
      unfilledColor={palette.lighterGrey0}
      borderWidth={0}
      height={12}
      width={null}
      borderRadius={30}
    />
  );
}
