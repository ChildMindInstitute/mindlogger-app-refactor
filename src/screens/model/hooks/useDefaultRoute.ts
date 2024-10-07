import { useHasSession } from '@app/entities/session/model/hooks/useHasSession';
import { ScreenRoute } from '@app/screens/config/types';

export function useDefaultRoute(): ScreenRoute {
  const hasSession = useHasSession();

  return hasSession ? 'Applets' : 'Login';
}
