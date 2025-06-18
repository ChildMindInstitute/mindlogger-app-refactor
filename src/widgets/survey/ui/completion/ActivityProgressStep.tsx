import { palette } from '@app/shared/lib/constants/palette';
import { YStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

type Props = {
  currentActivity: number;
  totalActivities: number;
  currentActivityName: string;
  currentSecondLevelStep: string;
};

export const ActivityProgressStep = ({
  currentActivity,
  totalActivities,
  currentActivityName,
  currentSecondLevelStep,
}: Props) => {
  return (
    <YStack>
      <Text
        fontSize={12}
        fontWeight="700"
        lineHeight={27}
        color={palette.blue3}
      >
        {`Activity ${currentActivity + 1} of ${totalActivities}`}
      </Text>
      <Text
        fontSize={16}
        fontWeight="700"
        lineHeight={27}
        numberOfLines={1}
        color={palette.on_surface}
      >
        {currentActivityName}
      </Text>
      <Text
        fontSize={12}
        fontWeight="400"
        lineHeight={27}
        letterSpacing={0.1}
        color={palette.on_surface}
      >
        {currentSecondLevelStep}
      </Text>
    </YStack>
  );
};
