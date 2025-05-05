import React, { FC, useMemo, useState } from 'react';
import { Linking } from 'react-native';

import { RequestHealthRecordDataResponse } from '@app/features/pass-survey/lib/types/payload';
import { colors } from '@app/shared/lib/constants/colors';
import { Box, RadioGroup, YStack } from '@app/shared/ui/base';
import { HealthRecordIcon } from '@app/shared/ui/icons/HealthRecord';
import { Link } from '@app/shared/ui/Link';
import { RadioOption } from '@app/shared/ui/survey/RadioActivityItem/types';
import { Text } from '@app/shared/ui/Text';


// TODO: Update to the correct URL when available
// https://mindlogger.atlassian.net/browse/M2-9101
const REQUEST_HEALTH_RECORD_DATA_LINK = 'https://mindlogger.org/';

export type RequestHealthRecordDataConfig = {
  optInOutOptions: [
    {
      id: 'opt_in';
      label: string;
    },
    {
      id: 'opt_out';
      label: string;
    },
  ];
};

type RequestHealthRecordDataItemProps = {
  config: RequestHealthRecordDataConfig;
  question: string;
  onChange: (value: RadioOption) => void;
  initialValue?: RequestHealthRecordDataResponse;
  textReplacer: (markdown: string) => string;
  onValidationError?: (hasError: boolean) => void;
};

export const RequestHealthRecordDataItem: FC<
  RequestHealthRecordDataItemProps
> = ({
  config,
  question,
  onChange,
  initialValue,
  textReplacer,
  onValidationError,
}) => {
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
    const selectedOption =
      selectedOptionValue === 'opt_in' ? options[0] : options[1];

    setSelectedOptionId(selectedOptionValue);

    if (onValidationError) {
      onValidationError(false);
    }

    onChange(selectedOption);
  };

  const handleExternalLinkPress = () => {
    Linking.openURL(REQUEST_HEALTH_RECORD_DATA_LINK).catch(error => {
      console.error('Error opening URL:', error);
    });
  };

  return (
    <YStack space="$4" p="$4">
      <Box alignItems="center" mb="$4">
        <HealthRecordIcon />
      </Box>

      <Box mb="$4">
        <Text fontSize={17}>{questionText}</Text>
      </Box>

      <Box mb="$4">
        <Link
          onPress={handleExternalLinkPress}
          accessibilityLabel="external-link-button"
        >
          <Text color={colors.blue} textDecorationLine="none">
            Learn more about how MindLogger securely accesses healthcare data.
          </Text>
        </Link>
      </Box>

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
