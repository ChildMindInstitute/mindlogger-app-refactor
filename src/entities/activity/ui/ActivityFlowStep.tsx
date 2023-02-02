import { FC } from 'react';

import { IS_ANDROID } from '@app/shared/lib';
import { Text, XStack, Image, BoxProps } from '@app/shared/ui';
import { badge } from '@assets/images';

import { ActivityListItem } from '../lib';

type Props = BoxProps & {
  activity: ActivityListItem;
  hasOpacity: boolean;
};

const ActivityFlowStep: FC<Props> = props => {
  const { activity, hasOpacity } = props;

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

      <Text color="$darkGrey" opacity={hasOpacity ? 0.5 : 1}>
        {`(${
          activity.activityPositionInFlow! + 1
        } of ${activity.numberOfActivitiesInFlow!}) ${
          activity.activityFlowName
        }`}
      </Text>
    </XStack>
  );
};

export default ActivityFlowStep;
