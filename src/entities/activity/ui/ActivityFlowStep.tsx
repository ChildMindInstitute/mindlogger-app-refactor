import { FC } from 'react';
import { Image } from 'react-native';

import { XStackProps } from '@tamagui/stacks';

import { IS_ANDROID } from '@app/shared/lib/constants';
import { XStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';
import { badge } from '@assets/images';

import { ActivityListItem } from '../lib/types/activityListItem';

type Props = XStackProps & {
  activity: ActivityListItem;
  hasOpacity: boolean;
};

export const ActivityFlowStep: FC<Props> = props => {
  const { activity, hasOpacity } = props;

  const { activityPositionInFlow, numberOfActivitiesInFlow, activityFlowName } =
    activity.activityFlowDetails!;

  return (
    <XStack {...props}>
      <Image
        source={badge}
        width={18}
        height={18}
        style={{
          marginRight: 3,
          marginTop: IS_ANDROID ? 2 : 0,
          opacity: 0.6,
          width: 18,
          height: 18,
        }}
      />

      <Text
        color="$darkGrey"
        aria-label="activity-card-flow"
        opacity={hasOpacity ? 0.5 : 1}
      >
        {`(${activityPositionInFlow} of ${numberOfActivitiesInFlow}) ${activityFlowName}`}
      </Text>
    </XStack>
  );
};
