import { IdentityModel } from '@entities/identity';
import { SessionModel } from '@entities/session';
import { useAppDispatch } from '@shared/lib';

export function useLogout() {
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(IdentityModel.actions.logout());
    SessionModel.clearSession();
  };

  return logout;
}
