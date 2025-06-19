import { FC } from 'react';
import { AccessibilityProps } from 'react-native';

import { AnalyticsChart } from '@app/features/analytics-chart/ui/AnalyticsChart';
import { Box, YStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

import { ActivityResponses } from '../lib/types';

type Props = {
  responseData: ActivityResponses;
};

export const ActivityAnalyticsCard: FC<Props & AccessibilityProps> = ({
  responseData,
  accessibilityLabel,
}) => {
  const { description, name } = responseData;

  return (
    <YStack
      mb={16}
      p={16}
      bg="$surface"
      br={16}
      gap={16}
      ai="center"
      aria-label={accessibilityLabel}
    >
      <Text fontSize={22} lineHeight={28} textAlign="center">
        {name}
      </Text>

      {description && <Text>{description}</Text>}

      {responseData.responses?.map((response, index) => (
        <Box key={index}>
          <AnalyticsChart
            title={response.name}
            responseType={response.type}
            responseConfig={response.responseConfig}
            data={response.data}
          />
        </Box>
      ))}
    </YStack>
  );
};
