import { useContext } from 'react';

import { ProgressBar } from '@shared/ui';

import { ValuesContext } from './contexts';

function Progress() {
  const { getCurrentStep, stepsCount } = useContext(ValuesContext);

  const progress = (getCurrentStep() + 1) / stepsCount;

  return <ProgressBar progress={progress} />;
}

export default Progress;
