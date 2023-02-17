import { PropsWithChildren, useState, useMemo, useRef } from 'react';

import { SplashContext } from '@shared/lib';
import { Splash } from '@shared/ui';

function SplashProvider({ children }: PropsWithChildren<unknown>) {
  const [isLoading, setIsLoading] = useState(true);
  const moduleWaitList = useRef(['cache', 'state']);

  const contextValue = useMemo(
    () => ({
      setLoadingState: (value: boolean) => {
        if (moduleWaitList.current.length !== 0) {
          return;
        }

        setIsLoading(value);
      },
      onModuleInitialized: (module: string) => {
        moduleWaitList.current = moduleWaitList.current.filter(
          item => item !== module,
        );

        if (moduleWaitList.current.length === 0) {
          setIsLoading(false);
        }
      },
    }),
    [],
  );

  return (
    <>
      <SplashContext.Provider value={contextValue}>
        {children}
      </SplashContext.Provider>

      <Splash isAppReady={!isLoading} />
    </>
  );
}

export default SplashProvider;
