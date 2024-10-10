import { useContext } from 'react';

import { ValuesContext, RefContext } from './contexts';
import { ViewSlider } from '../ViewSlider';

type Item = {
  index: number;
};

type Props = {
  renderItem: (item: Item) => JSX.Element;
};

export function ViewList({ renderItem }: Props) {
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
