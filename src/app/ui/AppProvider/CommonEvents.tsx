import { FC, PropsWithChildren } from 'react';

import { IdentityModel } from '@entities/identity';

const CommonEvents: FC<PropsWithChildren> = ({ children }) => {
  IdentityModel.useOnRefreshTokenFail(() => {
    // call logout feature here
  });

  return <>{children}</>;
};

export default CommonEvents;
