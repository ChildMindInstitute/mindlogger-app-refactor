import { Session } from '../model/types';

const isEqual = (
  prevSession: Partial<Session>,
  nextSession: Partial<Session>,
) => {
  return (
    prevSession.accessToken === nextSession.accessToken &&
    prevSession.refreshToken === nextSession.refreshToken &&
    prevSession.tokenType === nextSession.tokenType
  );
};

export function memoizeSession(getSession: () => Partial<Session>) {
  let session = {} as Partial<Session>;

  return () => {
    const newSession = getSession();

    session = isEqual(session, newSession) ? session : newSession;

    return session;
  };
}
