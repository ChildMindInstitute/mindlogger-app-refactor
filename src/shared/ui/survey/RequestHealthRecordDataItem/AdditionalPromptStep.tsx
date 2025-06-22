import { FC, useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { useActivityStorageRecord } from '@app/features/pass-survey/lib/hooks/useActivityStorageRecord';
import { RequestHealthRecordDataPipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { useActivityState } from '@app/features/pass-survey/model/hooks/useActivityState';
import { Box, RadioGroup, YStack } from '@app/shared/ui/base';
import { RequestHealthRecordDataIconSuccess } from '@app/shared/ui/icons/RequestHealthRecordDataIconSuccess';
import { ItemMarkdown } from '@app/shared/ui/survey/ItemMarkdown';
import { RadioOption } from '@app/shared/ui/survey/RadioActivityItem/types';

import { RadioItem } from '../RadioActivityItem/RadioItem';

type AdditionalPromptStepProps = {
  item: RequestHealthRecordDataPipelineItem;
  textReplacer: (markdown: string) => string;
  assignment: Assignment | null;
};

export const AdditionalPromptStep: FC<AdditionalPromptStepProps> = ({
  item,
  textReplacer,
  assignment,
}) => {
  const { t } = useTranslation();

  const { appletId, activityId, eventId, targetSubjectId, order } = useContext(
    ActivityIdentityContext,
  );

  const { getCurrentActivityStorageRecord } = useActivityStorageRecord({
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  });

  const { setItemCustomProperty } = useActivityState({
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  });

  const baseOption = {
    tooltip: null,
    image: null,
    score: null,
    color: null,
    isHidden: false,
  };

  const additionalOptions: RadioOption[] = [
    {
      ...baseOption,
      id: 'requested',
      text: t('requestHealthRecordData:yes'),
      value: 0,
    },
    {
      ...baseOption,
      id: 'done',
      text: t('requestHealthRecordData:no'),
      value: 1,
    },
  ];

  const handleValueChange = (value: string) => {
    const activityProgress = getCurrentActivityStorageRecord();
    if (!activityProgress) return;

    setItemCustomProperty<RequestHealthRecordDataPipelineItem>(
      activityProgress.step,
      'additionalEHRs',
      value,
    );
  };

  return (
    <YStack space="$4" px="$4" py="$6">
      <Box alignItems="center" mb="$2">
        <RequestHealthRecordDataIconSuccess />
      </Box>

      <ItemMarkdown
        content={t('requestHealthRecordData:additionalPromptText')}
        textVariableReplacer={textReplacer}
        assignment={assignment}
        alignToLeft
      />

      <RadioGroup
        value={item.additionalEHRs ?? ''}
        onValueChange={handleValueChange}
        name="ehr-consent"
        accessibilityLabel="ehr-consent-options"
      >
        {additionalOptions.map(option => {
          const isSelected = option.id === item.additionalEHRs;

          return (
            <Box key={option.id} onPress={() => handleValueChange(option.id)}>
              <RadioItem
                aria-label={`ehr-additional-option-${option.id}`}
                option={option}
                selected={isSelected}
                imageContainerVisible={false}
                tooltipContainerVisible={false}
                addTooltip={false}
                setPalette={false}
                textReplacer={textReplacer}
              />
            </Box>
          );
        })}
      </RadioGroup>
    </YStack>
  );
};
