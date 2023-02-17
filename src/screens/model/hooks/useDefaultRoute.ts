import { SessionModel } from '@entities/session';

import { ScreenRoute } from '../../config';

function useDefaultRoute(): ScreenRoute {
  const hasSession = SessionModel.useHasSession();

  return hasSession ? 'Applets' : 'Login';
}

export default useDefaultRoute;
