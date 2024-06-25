import { FC } from 'react';

import { Spinner } from '@shared/ui';

import { FlexContainer } from './containers';

const Loading: FC = () => {
  return (
    <FlexContainer justifyContent="center">
      <Spinner size={80} />
    </FlexContainer>
  );
};

export default Loading;
