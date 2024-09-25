import { useEffect } from 'react';

import { selectUserId } from '@app/entities/identity/model/selectors';
import { useHasSession } from '@app/entities/session/model/hooks/useHasSession';
import { FeatureFlagsService } from '@app/shared/lib/featureFlags/FeatureFlagsService';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

export function useFeatureFlagsAutoLogin() {
  const id = useAppSelector(selectUserId);
  const hasSession = useHasSession();

  useEffect(() => {
    if (!hasSession || !id) {
      return;
    }
    FeatureFlagsService.login(id);
  }, [id, hasSession]);
}
