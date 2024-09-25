import { FC } from 'react';

import { Spinner } from '@app/shared/ui/Spinner';

import { FlexContainer } from './containers';

export const Loading: FC = () => {
  return (
    <FlexContainer justifyContent="center">
      <Spinner size={80} />
    </FlexContainer>
  );
};
