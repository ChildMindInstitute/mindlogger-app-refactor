import { FC } from 'react';

import { RequestHealthRecordDataPipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { Box, YStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

import { HealthRecordIcon } from '../../icons/HealthRecord';

type AdditionalPromptStepProps = {
  item: RequestHealthRecordDataPipelineItem;
  textReplacer: (markdown: string) => string;
  onComplete?: () => void;
};

export const AdditionalPromptStep: FC<AdditionalPromptStepProps> = () => {
  return (
    <YStack space="$4" p="$4">
      <Box alignItems="center">
        <HealthRecordIcon />
      </Box>
      <Text>Step 4</Text>
    </YStack>
  );
};
