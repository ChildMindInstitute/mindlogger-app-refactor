import React, { FC, useMemo, useState } from 'react';
import { Linking } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import { RequestHealthRecordDataResponse } from '@app/features/pass-survey/lib/types/payload';
import { RequestHealthRecordDataAnswerSettings } from '@app/shared/api/services/ActivityItemDto';
import { colors } from '@app/shared/lib/constants/colors';
import { Box, RadioGroup, YStack } from '@app/shared/ui/base';
import { HealthRecordIcon } from '@app/shared/ui/icons/HealthRecord';
import { Link } from '@app/shared/ui/Link';
import { RadioOption } from '@app/shared/ui/survey/RadioActivityItem/types';
import { Text } from '@app/shared/ui/Text';

import { ItemMarkdown } from '../ItemMarkdown';

// TODO: Update to the correct URL when available
// https://mindlogger.atlassian.net/browse/M2-9101
const REQUEST_HEALTH_RECORD_DATA_LINK = 'https://mindlogger.org/';

type RequestHealthRecordDataItemProps = {
  config: RequestHealthRecordDataAnswerSettings;
  question: string;
  onChange: (value: RequestHealthRecordDataResponse) => void;
  initialValue?: RequestHealthRecordDataResponse;
  textReplacer: (markdown: string) => string;
  assignment: Assignment | null;
};

export const RequestHealthRecordDataItem: FC<
  RequestHealthRecordDataItemProps
> = ({
  config,
  question,
  onChange,
  initialValue,
  textReplacer,
  assignment,
}) => {
  const { t } = useTranslation();
  const [selectedOptionId, setSelectedOptionId] = useState(
    initialValue ?? null,
  );
  const questionText = useMemo(
    () => textReplacer(question),
    [question, textReplacer],
  );

  const options: RadioOption[] = useMemo(
    () =>
      config.optInOutOptions.map((option, index) => ({
        id: option.id,
        text: option.label,
        image: null,
        score: null,
        tooltip: null,
        color: null,
        isHidden: false,
        value: index,
      })),
    [config.optInOutOptions],
  );

  const handleValueChange = (value: string) => {
    const selectedOptionValue = value as RequestHealthRecordDataResponse;
    setSelectedOptionId(selectedOptionValue);
    onChange(selectedOptionValue);
  };

  const handleExternalLinkPress = () => {
    Linking.openURL(REQUEST_HEALTH_RECORD_DATA_LINK).catch(error => {
      console.error('Error opening URL:', error);
    });
  };

  return (
    <YStack space="$4" p="$4">
      <Box alignItems="center">
        <HealthRecordIcon />
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
        <Text color={colors.blue} textDecorationLine="none" fontSize={18}>
          {t('requestHealthRecordData:linkText')}
        </Text>
      </Link>

      <RadioGroup
        value={selectedOptionId ?? ''}
        onValueChange={handleValueChange}
        name="ehr-consent"
        accessibilityLabel="ehr-consent-options"
        gap={16}
      >
        {options.map(option => {
          const isSelected = option.id === selectedOptionId;

          return (
            <Box
              key={option.id}
              borderColor={isSelected ? colors.blue : colors.lighterGrey7}
              borderWidth={2}
              backgroundColor={isSelected ? colors.lightBlue : undefined}
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
                  borderColor={isSelected ? colors.blue : colors.outlineGrey}
                  borderWidth={3}
                  backgroundColor="transparent"
                  value={option.id}
                >
                  <RadioGroup.Indicator
                    bg={isSelected ? colors.blue : colors.outlineGrey}
                  />
                </RadioGroup.Item>
                <Text fontSize={18} color={colors.onSurface}>
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
