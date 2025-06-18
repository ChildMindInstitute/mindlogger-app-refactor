import { FC, useMemo } from 'react';
import { Linking } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import { RequestHealthRecordDataResponse } from '@app/features/pass-survey/lib/types/payload';
import { RequestHealthRecordDataPipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { palette } from '@app/shared/lib/constants/palette';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { Box, RadioGroup, YStack } from '@app/shared/ui/base';
import { RequestHealthRecordDataIcon } from '@app/shared/ui/icons/RequestHealthRecordDataIcon';
import { Link } from '@app/shared/ui/Link';
import { ItemMarkdown } from '@app/shared/ui/survey/ItemMarkdown';
import { RadioOption } from '@app/shared/ui/survey/RadioActivityItem/types';
import { Text } from '@app/shared/ui/Text';

// TODO: Update to the correct URL when available
// https://mindlogger.atlassian.net/browse/M2-9101
const REQUEST_HEALTH_RECORD_DATA_LINK = 'https://mindlogger.org/';

type ConsentPromptStepProps = {
  item: RequestHealthRecordDataPipelineItem;
  textReplacer: (markdown: string) => string;
  onChange: (value: RequestHealthRecordDataResponse) => void;
  responseValue?: RequestHealthRecordDataResponse;
  assignment: Assignment | null;
};

export const ConsentPromptStep: FC<ConsentPromptStepProps> = ({
  item,
  textReplacer,
  onChange,
  responseValue,
  assignment,
}) => {
  const { t } = useTranslation();
  const questionText = useMemo(
    () => textReplacer(item.question),
    [item.question, textReplacer],
  );

  const options: RadioOption[] = useMemo(
    () =>
      item.payload.optInOutOptions.map((option, index) => ({
        id: option.id,
        text: option.label,
        image: null,
        score: null,
        tooltip: null,
        color: null,
        isHidden: false,
        value: index,
      })),
    [item.payload.optInOutOptions],
  );

  const handleValueChange = (value: string) => {
    onChange(value as RequestHealthRecordDataResponse);
  };

  const handleExternalLinkPress = () => {
    Linking.openURL(REQUEST_HEALTH_RECORD_DATA_LINK).catch(error => {
      getDefaultLogger().error(`Error opening URL: ${error}`);
    });
  };

  return (
    <YStack space="$4" px="$4" py="$6">
      <Box alignItems="center">
        <RequestHealthRecordDataIcon />
      </Box>

      <ItemMarkdown
        content={questionText}
        textVariableReplacer={textReplacer}
        assignment={assignment}
        alignToLeft
      />

      <Link
        onPress={handleExternalLinkPress}
        accessibilityLabel="external-link-button"
      >
        <Text color={palette.blue} textDecorationLine="none" fontSize={18}>
          {t('requestHealthRecordData:linkText')}
        </Text>
      </Link>

      <RadioGroup
        value={responseValue ?? ''}
        onValueChange={handleValueChange}
        name="ehr-consent"
        accessibilityLabel="ehr-consent-options"
        gap={16}
      >
        {options.map(option => {
          const isSelected = option.id === responseValue;

          return (
            <Box
              key={option.id}
              borderColor={isSelected ? palette.blue : palette.lighterGrey7}
              borderWidth={2}
              backgroundColor={isSelected ? palette.lightBlue : undefined}
              px={18}
              py={20}
              borderRadius={12}
              onPress={() => handleValueChange(option.id)}
            >
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
                gap="$3"
              >
                <RadioGroup.Item
                  accessibilityLabel={`ehr-option-${option.id}`}
                  borderColor={
                    isSelected ? palette.blue : palette.surface_variant
                  }
                  borderWidth={3}
                  backgroundColor="transparent"
                  value={option.id}
                >
                  <RadioGroup.Indicator
                    background={
                      isSelected ? palette.blue : palette.surface_variant
                    }
                  />
                </RadioGroup.Item>
                <Text fontSize={18} color={palette.on_surface}>
                  {option.text}
                </Text>
              </Box>
            </Box>
          );
        })}
      </RadioGroup>
    </YStack>
  );
};
