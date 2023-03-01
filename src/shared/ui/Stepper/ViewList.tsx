import { useContext, useMemo } from 'react';

import { range } from '@shared/lib';
import { ViewSlider } from '@shared/ui';

import { ValuesContext, RefContext } from './contexts';

type Item = {
  index: number;
};

type Props = {
  renderItem: (item: Item) => JSX.Element;
};

function ViewList({ renderItem }: Props) {
  const { currentStep, stepsCount } = useContext(ValuesContext);
  const ref = useContext(RefContext);

  const steps = useMemo(() => range(stepsCount), [stepsCount]);

  return (
    <ViewSlider startFrom={currentStep} ref={ref}>
      {steps.map(index => renderItem({ index }))}
    </ViewSlider>
  );
}

export default ViewList;
