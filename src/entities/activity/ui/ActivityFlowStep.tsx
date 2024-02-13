import { FC } from 'react';

import { IS_ANDROID } from '@app/shared/lib';
import { Text, XStack, Image, BoxProps } from '@app/shared/ui';
import { badge } from '@assets/images';

import { ActivityListItem } from '../lib';

type Props = BoxProps & {
  activity: ActivityListItem;
  hasOpacity: boolean;
};

const ActivityFlowStep: FC<Props> = (props) => {
  const { activity, hasOpacity } = props;

  const { activityPositionInFlow, numberOfActivitiesInFlow, activityFlowName } =
    activity.activityFlowDetails!;

  return (
    <XStack {...props}>
      <Image
        src={badge}
        width={18}
        height={18}
        mr={3}
        mt={IS_ANDROID ? 2 : 0}
        opacity={0.6}
      />

      <Text
        color="$darkGrey"
        accessibilityLabel="activity-card-flow"
        opacity={hasOpacity ? 0.5 : 1}
      >
        {`(${activityPositionInFlow} of ${numberOfActivitiesInFlow}) ${activityFlowName}`}
      </Text>
    </XStack>
  );
};

export default ActivityFlowStep;
