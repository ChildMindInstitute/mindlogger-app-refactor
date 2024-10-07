import { useEffect } from 'react';

import { selectUserId } from '@app/entities/identity/model/selectors';
import { useHasSession } from '@app/entities/session/model/hooks/useHasSession';
import { getDefaultFeatureFlagsService } from '@app/shared/lib/featureFlags/featureFlagsServiceInstance';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

export function useFeatureFlagsAutoLogin() {
  const id = useAppSelector(selectUserId);
  const hasSession = useHasSession();

  useEffect(() => {
    if (!hasSession || !id) {
      return;
    }
    getDefaultFeatureFlagsService().login(id).catch(console.error);
  }, [id, hasSession]);
}
