import { createContext, useContext } from 'react';

type SplashContext = {
  setLoadingState: (this: void, value: boolean) => any;
  onModuleInitialized: (module: string) => void;
};

export const SplashContext = createContext<SplashContext>({
  setLoadingState: () => {},
  onModuleInitialized: () => {},
});

export function useSplash() {
  return useContext(SplashContext);
}
