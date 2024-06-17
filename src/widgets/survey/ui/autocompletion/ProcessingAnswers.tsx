import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Spinner, Text } from '@shared/ui';

import { FlexContainer } from './common';

const ProcessingAnswers: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <FlexContainer justifyContent="flex-end">
        <Spinner size={80} />
        <Text fontSize={25}>{t('autocompletion:processing_answers')}</Text>
      </FlexContainer>

      <FlexContainer justifyContent="flex-start">
        <Text textAlign="center">{t('autocompletion:preparing_answers')}</Text>
      </FlexContainer>
    </>
  );
};

export default ProcessingAnswers;
