import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { colors } from '@app/shared/lib';
import { ActivityIndicator, Text } from '@shared/ui';

import { FlexContainer } from './common';

const ProcessingAnswers: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <FlexContainer justifyContent="flex-end">
        <ActivityIndicator size={'large'} color={colors.blue} />
        <Text fontSize={31} fontWeight="600">
          {t('autocompletion:processing_answers')}
        </Text>
      </FlexContainer>

      <FlexContainer justifyContent="flex-start">
        <Text fontSize={18} textAlign="center">
          {t('autocompletion:preparing_answers')}
        </Text>
      </FlexContainer>
    </>
  );
};

export default ProcessingAnswers;
