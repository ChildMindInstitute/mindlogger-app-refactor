import { useSession } from './useSession';

export function useHasSession() {
  return !!useSession()?.accessToken;
}
