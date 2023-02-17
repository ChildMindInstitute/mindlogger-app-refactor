import { FC, PropsWithChildren } from 'react';

import { SessionModel } from '@entities/session';

const CommonEvents: FC<PropsWithChildren> = ({ children }) => {
  SessionModel.useOnRefreshTokenFail(() => {
    // call logout feature here
  });

  return <>{children}</>;
};

export default CommonEvents;
