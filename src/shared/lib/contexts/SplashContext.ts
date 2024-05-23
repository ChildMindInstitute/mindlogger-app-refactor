import { createContext, useCallback, useContext, useState } from 'react';

export type SystemModule =
  | 'cache'
  | 'state'
  | 'analytics'
  | 'storage'
  | 'featureFlags';

type SystemBootUpContext = {
  onModuleInitialized: (module: SystemModule) => void;
};

export const SystemBootUpContext = createContext<SystemBootUpContext>({
  onModuleInitialized: () => {},
});

export function useSystemBootUp() {
  const [initialized, setInitialized] = useState(false);

  const context = useContext(SystemBootUpContext);

  const onModuleInitialized = useCallback(
    (moduleName: SystemModule) => {
      context.onModuleInitialized(moduleName);
      setInitialized(true);
    },
    [context],
  );

  return {
    initialized,
    onModuleInitialized,
  };
}
