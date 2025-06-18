import { FC } from 'react';
import { AccessibilityProps } from 'react-native';

import { styled } from '@tamagui/core';

import { AnalyticsChart } from '@app/features/analytics-chart/ui/AnalyticsChart';
import { Box } from '@app/shared/ui/base';
import { Center } from '@app/shared/ui/Center';
import { Text } from '@app/shared/ui/Text';

import { ActivityResponses } from '../lib/types';

type Props = {
  responseData: ActivityResponses;
};

const ActivityCardContainer = styled(Center, {
  mt: 10,
  pt: 10,
  backgroundColor: '$white',
});

export const ActivityAnalyticsCard: FC<Props & AccessibilityProps> = ({
  responseData,
  accessibilityLabel,
}) => {
  const { description, name } = responseData;

  return (
    <ActivityCardContainer accessibilityLabel={accessibilityLabel}>
      <Text fontSize={30}>{name}</Text>

      {description && <Text fontSize={15}>{description}</Text>}

      {responseData.responses?.map((response, index) => (
        <Box pb={5} key={index}>
          <AnalyticsChart
            title={response.name}
            responseType={response.type}
            responseConfig={response.responseConfig}
            data={response.data}
          />
        </Box>
      ))}
    </ActivityCardContainer>
  );
};
