import { colors } from '@app/shared/lib';
import { Text, YStack } from '@shared/ui';

type Props = {
  currentActivity: number;
  totalActivities: number;
  currentActivityName: string;
  currentSecondLevelStep: string;
};

export default ({
  currentActivity,
  totalActivities,
  currentActivityName,
  currentSecondLevelStep,
}: Props) => {
  return (
    <YStack>
      <Text fos={12} fow="700" lh={27} color={colors.blue3}>
        {`Activity ${currentActivity + 1} of ${totalActivities}`}
      </Text>
      <Text fos={16} fow="700" lh={27} numberOfLines={1} col={colors.onSurface}>
        {currentActivityName}
      </Text>
      <Text fos={12} fow="400" lh={27} ls={0.1} col={colors.onSurface}>
        {currentSecondLevelStep}
      </Text>
    </YStack>
  );
};
