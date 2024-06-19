import { Bar } from 'react-native-progress';

import { colors } from '../lib';

type Props = {
  progress: number;
};

function HeaderProgressBar({ progress }: Props) {
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

export default HeaderProgressBar;
