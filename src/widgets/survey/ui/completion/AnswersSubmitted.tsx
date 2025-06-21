import { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, YStack } from '@app/shared/ui/base';
import { AnswersSubmittedIcon } from '@app/shared/ui/icons/AnswersSubmittedIcon';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

import { SubComponentProps } from './containers';

export const AnswersSubmitted: FC<SubComponentProps> = ({ onPressDone }) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  return (
    <YStack ai="center" jc="center" flex={1} pb={bottom}>
      <AnswersSubmittedIcon style={{ marginBottom: 32 }} />
      <Text
        accessibilityLabel="answer_submitted"
        fontSize={32}
        lineHeight={40}
        mb={14}
      >
        {t('autocompletion:answers_submitted')}
      </Text>
      <Text
        accessibilityLabel="answer_saved_thanks"
        fontSize={18}
        lineHeight={28}
        mb={32}
      >
        {t('autocompletion:thanks')}
      </Text>
      <Box w="100%" maxWidth={356}>
        <SubmitButton
          accessibilityLabel="close-button"
          mode="primary"
          onPress={onPressDone}
        >
          {t('autocompletion:done')}
        </SubmitButton>
      </Box>
    </YStack>
  );
};
