import { FC } from 'react';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { Activity } from '@entities/applet';
import { Center, Text } from '@shared/ui';

type Props = {
  activity: Activity;
};

const ActivityCardContainer = styled(Center, {
  mt: 10,
  pt: 10,
  backgroundColor: '$white',
});

const ActivityAnalyticsCard: FC<Props> = ({ activity }) => {
  const isResponseDataAvailable = false;
  const { t } = useTranslation();

  return (
    <ActivityCardContainer>
      <Text fontSize={30}>{activity.name}</Text>

      <Text color="$tertiary" fontWeight="500" fontSize={15}>
        {activity.description}
      </Text>

      {!isResponseDataAvailable && (
        <Text p={20} fontWeight="400">
          {t('applet_data:title')}
        </Text>
      )}
    </ActivityCardContainer>
  );
};

export default ActivityAnalyticsCard;
