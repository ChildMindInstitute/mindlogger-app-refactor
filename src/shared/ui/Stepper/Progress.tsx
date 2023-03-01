import { useContext } from 'react';

import { ProgressBar } from '@shared/ui';

import { ValuesContext } from './contexts';

function Progress() {
  const { currentStep, stepsCount } = useContext(ValuesContext);

  const progress = (currentStep + 1) / stepsCount;

  return <ProgressBar progress={progress} />;
}

export default Progress;
