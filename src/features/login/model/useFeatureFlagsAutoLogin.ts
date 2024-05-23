import { useEffect } from 'react';

import { IdentityModel } from '@app/entities/identity';
import { SessionModel } from '@app/entities/session';
import { useAppSelector, FeatureFlagsService } from '@shared/lib';

function useFeatureFlagsAutoLogin() {
  const id = useAppSelector(IdentityModel.selectors.selectUserId);
  const hasSession = SessionModel.useHasSession();

  useEffect(() => {
    if (!hasSession || !id) {
      return;
    }
    FeatureFlagsService.login(id);
  }, [id, hasSession]);
}

export default useFeatureFlagsAutoLogin;
