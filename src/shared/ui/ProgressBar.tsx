import { Bar } from 'react-native-progress';

import { colors } from '../lib';

type Props = {
  progress: number;
};

function ProgressBar({ progress }: Props) {
  return (
    <Bar
      progress={progress}
      color={colors.blue}
      unfilledColor={colors.grey2}
      borderWidth={0}
      height={10}
      width={null}
    />
  );
}

export default ProgressBar;
