import { Bar } from 'react-native-progress';

import { colors } from '../lib/constants/colors';

type Props = {
  progress: number;
};

export function HeaderProgressBar({ progress }: Props) {
  return (
    <Bar
      progress={progress}
      color={colors.blue}
      unfilledColor={colors.lighterGrey0}
      borderWidth={0}
      height={12}
      width={null}
      borderRadius={30}
    />
  );
}
