import { FC } from 'react';

import { XStackProps } from '@tamagui/stacks';
import { useTranslation } from 'react-i18next';

import { palette } from '@app/shared/lib/constants/palette';
import { XStack } from '@app/shared/ui/base';
import { MultipleActivitiesIcon } from '@app/shared/ui/icons/MultipleActivities';
import { Text } from '@app/shared/ui/Text';

import { ActivityFlowDetails } from '../lib/types/activityListItem';

type Props = XStackProps & Omit<ActivityFlowDetails, 'showActivityFlowBadge'>;

export const ActivityFlowStep: FC<Props> = props => {
  const { t } = useTranslation();
  const { activityPositionInFlow, numberOfActivitiesInFlow, activityFlowName } =
    props;

  return (
    <XStack gap={5} padding={4} ai="center" {...props}>
      <MultipleActivitiesIcon color={palette.on_surface_variant} />

      <Text
        fontSize={14}
        letterSpacing={0.25}
        color="$on_surface_variant"
        aria-label="activity-card-flow"
      >
        {t('activity:flowStep', {
          activityPositionInFlow,
          numberOfActivitiesInFlow,
          activityFlowName,
        })}
      </Text>
    </XStack>
  );
};
