import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Box } from '@app/shared/ui/base';
import { TimerSandIcon } from '@app/shared/ui/icons';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

import { FlexContainer, SubComponentProps } from './containers';

export const TimesUp: FC<SubComponentProps> = ({ onPressDone }) => {
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

        <Box w="100%" maxWidth={356}>
          <SubmitButton mode="primary" onPress={onPressDone}>
            {t('autocompletion:done')}
          </SubmitButton>
        </Box>
      </FlexContainer>
    </>
  );
};
