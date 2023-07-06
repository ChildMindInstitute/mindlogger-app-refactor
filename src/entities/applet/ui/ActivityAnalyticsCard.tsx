import { FC } from 'react';

import { styled } from '@tamagui/core';

import { AnalyticsChart } from '@app/features/analytics-chart';
import { ActivityResponsesDto } from '@shared/api';
import { Box, Center, Text } from '@shared/ui';

type Props = {
  responseData: ActivityResponsesDto;
};

const ActivityCardContainer = styled(Center, {
  mt: 10,
  pt: 10,
  backgroundColor: '$white',
});

const ActivityAnalyticsCard: FC<Props> = ({ responseData }) => {
  return (
    <ActivityCardContainer>
      <Text fontSize={30}>{responseData.name}</Text>

      {responseData.responses?.map(response => (
        <Box pt={10} pb={10}>
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
