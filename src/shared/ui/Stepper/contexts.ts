import { createContext, Ref } from 'react';

import { ViewSliderRef } from '@shared/ui';

type Handlers = {
  next: () => void;
  back: () => void;
  undo: () => void;
};

type Values = {
  currentStep: number;
  stepsCount: number;
};

export const HandlersContext = createContext<Handlers>({} as Handlers);
export const ValuesContext = createContext<Values>({} as Values);
export const RefContext = createContext<Ref<ViewSliderRef>>(
  {} as Ref<ViewSliderRef>,
);
