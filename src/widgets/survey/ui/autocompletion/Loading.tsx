import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Spinner } from '@shared/ui';

import { FlexContainer } from './common';

const Loading: FC = () => {
  const { t } = useTranslation();

  return (
    <FlexContainer justifyContent="center">
      <Spinner size={80} />
    </FlexContainer>
  );
};

export default Loading;
