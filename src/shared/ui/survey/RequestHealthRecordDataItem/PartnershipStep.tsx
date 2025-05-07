import { FC } from 'react';

import { Box, YStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

import { HealthRecordIcon } from '../../icons/HealthRecord';

export const PartnershipStep: FC = () => {
  return (
    <YStack space="$4" p="$4">
      <Box alignItems="center">
        <HealthRecordIcon />
      </Box>
      <Text>Step 2</Text>
    </YStack>
  );
};
