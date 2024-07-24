import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Box, SubmitButton, Text, TimerSandIcon } from '@shared/ui';

import { FlexContainer, SubComponentProps } from './containers';

const TimesUp: FC<SubComponentProps> = ({ onPressDone }) => {
  const { t } = useTranslation();

  return (
    <>
      <FlexContainer justifyContent="flex-end">
        <TimerSandIcon color="#000" size={80} />
        <Text fontSize={25}>{t('autocompletion:time_limit_reached')}</Text>
      </FlexContainer>
      <FlexContainer justifyContent="flex-start">
        <Text textAlign="center">
          {t('autocompletion:time_expired', {
            activityNames: '[First Activity, Second Activity]',
          })}
        </Text>

        <Box w="100%">
          <SubmitButton mode="dark" onPress={onPressDone} borderRadius={20}>
            {t('autocompletion:done')}
          </SubmitButton>
        </Box>
      </FlexContainer>
    </>
  );
};

export default TimesUp;
