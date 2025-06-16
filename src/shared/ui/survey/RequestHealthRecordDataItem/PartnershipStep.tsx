import { FC } from 'react';
import { ImageStyle } from 'react-native';
import { Image } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import { Box, YStack } from '@app/shared/ui/base';
import { ItemMarkdown } from '@app/shared/ui/survey/ItemMarkdown';
import { requestHealthRecordDataIconPartnership } from '@assets/images';

type PartnershipStepProps = {
  textReplacer: (markdown: string) => string;
  assignment: Assignment | null;
};

export const PartnershipStep: FC<PartnershipStepProps> = ({
  textReplacer,
  assignment,
}) => {
  const { t } = useTranslation();

  return (
    <YStack gap="$4" px="$4" py="$8">
      <Box alignItems="center" mb="$2">
        <Image
          source={requestHealthRecordDataIconPartnership}
          width={343}
          height={75}
          style={imageStyle}
        />
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

const imageStyle: ImageStyle = {
  maxWidth: '100%',
  resizeMode: 'contain',
  width: 343,
  height: 75,
};
