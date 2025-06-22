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

import { RadioItem } from '../RadioActivityItem/RadioItem';

const REQUEST_HEALTH_RECORD_DATA_LINK =
  'https://mindlogger.atlassian.net/servicedesk/customer/portal/1/article/1238630401';

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
        <Text color={palette.secondary} textDecorationLine="none" fontSize={18}>
          {t('requestHealthRecordData:linkText')}
        </Text>
      </Link>

      <RadioGroup
        value={responseValue ?? ''}
        onValueChange={handleValueChange}
        name="ehr-consent"
        accessibilityLabel="ehr-consent-options"
      >
        {options.map(option => {
          const isSelected = option.id === responseValue;

          return (
            <Box key={option.id} onPress={() => handleValueChange(option.id)}>
              <RadioItem
                aria-label={`ehr-option-${option.id}`}
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
