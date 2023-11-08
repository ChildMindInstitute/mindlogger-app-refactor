import { createContext, useContext } from 'react';

type SystemBootUpContext = {
  onModuleInitialized: (module: string) => void;
};

export const SystemBootUpContext = createContext<SystemBootUpContext>({
  onModuleInitialized: () => {},
});

export function useSystemBootUp() {
  return useContext(SystemBootUpContext);
}
