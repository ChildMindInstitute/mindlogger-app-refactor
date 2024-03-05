import { useLogout } from '@app/features/logout/model';
import { onDeleteAccountConfirmed } from '@app/shared/lib';

export const useDeleteAccount = () => {
  const { forceLogout } = useLogout();

  const processDeleteAccount = () => {
    forceLogout();

    // todo: add api call for account deletion
    // todo: check if there are some pending responses

    return new Promise<void>(resolve =>
      setTimeout(() => {
        onDeleteAccountConfirmed();
        resolve();
      }, 1000),
    );
  };

  return {
    requestDeleteAccount: processDeleteAccount,
  };
};
