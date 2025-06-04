import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import { Box, YStack } from '@app/shared/ui/base';
import { RequestHealthRecordDataIconPartnership } from '@app/shared/ui/icons/RequestHealthRecordDataIconPartnership';
import { ItemMarkdown } from '@app/shared/ui/survey/ItemMarkdown';

type PartnershipStepProps = {
  textReplacer: (markdown: string) => string;
  assignment: Assignment | null;
};

export const PartnershipStep: FC<PartnershipStepProps> = ({
  textReplacer,
  assignment,
}) => {
  const { t } = useTranslation();
  const maxWidth = '100%';

  return (
    <YStack space="$4" px="$4" py="$8">
      <Box alignItems="center" mb="$2">
        <RequestHealthRecordDataIconPartnership style={{ maxWidth }} />
      </Box>

      <ItemMarkdown
        content={t('requestHealthRecordData:partnershipText')}
        textVariableReplacer={textReplacer}
        assignment={assignment}
        alignToLeft
      />
    </YStack>
  );
};
