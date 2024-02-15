import { PropsWithChildren, useMemo, useRef } from 'react';

import { SystemBootUpContext as SystemBootUpContext, wait } from '@shared/lib';

type Props = PropsWithChildren<{
  onLoadingFinished: () => void;
}>;

const SYSTEM_BOOT_UP_DELAY = 300;

function SystemBootUpProvider({ children, onLoadingFinished }: Props) {
  const moduleWaitList = useRef(['cache', 'state', 'analytics']);

  const onLoadingFinishedRef = useRef(onLoadingFinished);

  onLoadingFinishedRef.current = onLoadingFinished;

  const contextValue = useMemo(
    () => ({
      onModuleInitialized: async (module: string) => {
        moduleWaitList.current = moduleWaitList.current.filter(
          item => item !== module,
        );

        if (moduleWaitList.current.length === 0) {
          await wait(SYSTEM_BOOT_UP_DELAY);

          onLoadingFinishedRef.current();
        }
      },
    }),
    [],
  );

  return (
    <>
      <SystemBootUpContext.Provider value={contextValue}>
        {children}
      </SystemBootUpContext.Provider>
    </>
  );
}

export default SystemBootUpProvider;
