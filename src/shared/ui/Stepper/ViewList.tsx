import { useContext } from 'react';

import { ViewSlider } from '@shared/ui';

import { ValuesContext, RefContext } from './contexts';

type Item = {
  index: number;
};

type Props = {
  renderItem: (item: Item) => JSX.Element;
};

function ViewList({ renderItem }: Props) {
  const { getCurrentStep, stepsCount } = useContext(ValuesContext);
  const ref = useContext(RefContext);

  return (
    <ViewSlider
      viewCount={stepsCount}
      step={getCurrentStep()}
      ref={ref}
      renderView={item => renderItem(item)}
    />
  );
}

export default ViewList;
