import useSession from './useSession';

function useHasSession() {
  return !!useSession()?.accessToken;
}

export default useHasSession;
