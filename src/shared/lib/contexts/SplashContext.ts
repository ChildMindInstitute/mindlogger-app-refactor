import { createContext, useContext } from 'react';

type SlashContext = {
  setLoadingState: (this: void, value: boolean) => any;
  onModuleInitialized: (module: string) => void;
};

export const SplashContext = createContext<SlashContext>({
  setLoadingState: () => {},
  onModuleInitialized: () => {},
});

export function useSplash() {
  return useContext(SplashContext);
}
