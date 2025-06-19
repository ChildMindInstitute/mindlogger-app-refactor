import { useEffect, useRef } from 'react';

import { useNavigationState } from '@react-navigation/native';

import { selectUserId } from '@app/entities/identity/model/selectors';
import { useHasSession } from '@app/entities/session/model/hooks/useHasSession';
import { RootStackParamList } from '@app/screens/config/types';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

import { useRebrandBanner } from './useRebrandBanner';
import { dismissedBannersSelector } from '../../model/selectors';

export const useDefaultBanners = () => {
  const hasSession = useHasSession();
  const userId = useAppSelector(selectUserId);

  // Get the current route name using useNavigationState
  const currentRouteName = useNavigationState(state => {
    if (!state || !state.routes || state.routes.length === 0) {
      return undefined; // No active route yet
    }

    if (state.index === undefined || !state.routes[state.index]) {
      // If no route index or route not found but routes exist, use final route
      return state.routes[state.routes.length - 1]
        ?.name as keyof RootStackParamList;
    }

    return state.routes[state.index].name as keyof RootStackParamList;
  });

  const bannerScope = hasSession ? `user-${userId}` : 'global';

  const dismissed = useAppSelector(dismissedBannersSelector);
  // Save in ref to exclude from useEffect dependencies
  const dismissedRef = useRef(dismissed);

  useEffect(() => {
    dismissedRef.current = dismissed;
  }, [dismissed]);

  useRebrandBanner(dismissedRef.current, bannerScope, currentRouteName);
};
