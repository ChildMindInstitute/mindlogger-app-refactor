import { useContext } from 'react';

import { ValuesContext } from './contexts';
import { ProgressBar } from '../ProgressBar';

export function Progress() {
  const { getCurrentStep, stepsCount } = useContext(ValuesContext);

  const progress = (getCurrentStep() + 1) / stepsCount;

  return <ProgressBar progress={progress} />;
}
