import { useEffect, useRef } from 'react';

import { selectUserId } from '@app/entities/identity/model/selectors';
import { useHasSession } from '@app/entities/session/model/hooks/useHasSession';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

import { useRebrandBanner } from './useRebrandBanner';
import { dismissedBannersSelector } from '../../model/selectors';

export const useDefaultBanners = () => {
  const hasSession = useHasSession();
  const userId = useAppSelector(selectUserId);

  const bannerKey = hasSession ? `user-${userId}` : 'global';

  const dismissed = useAppSelector(dismissedBannersSelector);
  // Save in ref to exclude from useEffect dependencies
  const dismissedRef = useRef(dismissed);

  useEffect(() => {
    dismissedRef.current = dismissed;
  }, [dismissed]);

  useRebrandBanner(dismissedRef.current, bannerKey);
};
