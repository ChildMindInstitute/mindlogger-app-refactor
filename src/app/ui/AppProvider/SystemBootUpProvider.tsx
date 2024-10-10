import { PropsWithChildren, useMemo, useRef } from 'react';

import {
  SystemModule,
  SystemBootUpContext,
} from '@app/shared/lib/contexts/SplashContext';
import { wait } from '@app/shared/lib/utils/common';

type Props = PropsWithChildren<{
  onLoadingFinished: () => void;
}>;

const SYSTEM_BOOT_UP_DELAY = 300;

export function SystemBootUpProvider({ children, onLoadingFinished }: Props) {
  const moduleWaitList = useRef<Array<SystemModule>>([
    'cache',
    'state',
    'analytics',
    'storage',
  ]);

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
