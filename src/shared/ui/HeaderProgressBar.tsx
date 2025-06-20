import { Bar } from 'react-native-progress';

import { palette } from '../lib/constants/palette';

type Props = {
  progress: number;
};

export function HeaderProgressBar({ progress }: Props) {
  return (
    <Bar
      progress={progress}
      color={palette.green}
      unfilledColor={palette.surface_variant}
      borderWidth={0}
      height={16}
      width={null}
      borderRadius={30}
    />
  );
}
