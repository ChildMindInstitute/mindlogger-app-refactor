import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Box, CheckIcon, SubmitButton, Text } from '@shared/ui';

import { FlexContainer, SubComponentProps } from './common';

const AnswersSubmitted: FC<SubComponentProps> = ({ onPressDone }) => {
  const { t } = useTranslation();

  return (
    <>
      <FlexContainer justifyContent="flex-end">
        <Box bg="$alertSuccessIcon" borderRadius={100} p={10}>
          <CheckIcon color="white" size={60} />
        </Box>
        <Text fontSize={25}>{t('autocompletion:answers_submitted')}</Text>
      </FlexContainer>
      <FlexContainer justifyContent="flex-start">
        <Box w="100%">
          <SubmitButton mode="dark" onPress={onPressDone} borderRadius={20}>
            {t('autocompletion:done')}
          </SubmitButton>
        </Box>
      </FlexContainer>
    </>
  );
};

export default AnswersSubmitted;
