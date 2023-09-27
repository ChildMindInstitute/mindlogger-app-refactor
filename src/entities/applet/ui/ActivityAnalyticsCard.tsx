import { FC } from 'react';

import { styled } from '@tamagui/core';

import { AnalyticsChart } from '@app/features/analytics-chart';
import { Box, Center, Text } from '@shared/ui';

import { ActivityResponses } from '../lib';

type Props = {
  responseData: ActivityResponses;
};

const ActivityCardContainer = styled(Center, {
  mt: 10,
  pt: 10,
  backgroundColor: '$white',
});

const ActivityAnalyticsCard: FC<Props> = ({ responseData }) => {
  const { description, name } = responseData;

  return (
    <ActivityCardContainer>
      <Text fontSize={30} fontWeight="100">
        {name}
      </Text>

      {description && (
        <Text fontSize={15} fontWeight="200">
          {description}
        </Text>
      )}

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

export default ActivityAnalyticsCard;
