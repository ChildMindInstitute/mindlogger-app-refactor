import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Box } from '@app/shared/ui/base';
import { CheckIcon } from '@app/shared/ui/icons';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

import { FlexContainer, SubComponentProps } from './containers';

export const AnswersSubmitted: FC<SubComponentProps> = ({ onPressDone }) => {
  const { t } = useTranslation();

  return (
    <>
      <FlexContainer justifyContent="flex-end" mb={10}>
        <Box bg="$lightGreen2" borderRadius={100} p={10}>
          <CheckIcon color="white" size={60} />
        </Box>
        <Text
          accessibilityLabel="answer_submitted"
          fontSize={31}
          fontWeight="600"
        >
          {t('autocompletion:answers_submitted')}
        </Text>
        <Text accessibilityLabel="answer_saved_thanks" fontSize={18}>
          {t('autocompletion:thanks')}
        </Text>
      </FlexContainer>
      <FlexContainer justifyContent="flex-start">
        <Box w="100%">
          <SubmitButton
            accessibilityLabel="close-button"
            mode="dark"
            onPress={onPressDone}
            borderRadius={20}
            textProps={{ fontWeight: 'bold', fontSize: 15 }}
            py={16}
          >
            {t('autocompletion:done')}
          </SubmitButton>
        </Box>
      </FlexContainer>
    </>
  );
};
