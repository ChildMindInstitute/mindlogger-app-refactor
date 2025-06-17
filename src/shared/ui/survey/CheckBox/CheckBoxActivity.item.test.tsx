import { render } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import { CheckBoxActivityItem } from './CheckBoxActivity.item';
import { Item } from './types';

const options: Item[] = [
  {
    id: '37269e0e-9220-4c53-b3e6-86ec70c6a1d1',
    text: '1',
    color: null,
    isHidden: false,
    tooltip: null,
    image: null,
    score: null,
    value: 1,
  },
  {
    id: '37269e0e-9220-4c53-b3e6-86ec70c6a1d2',
    text: '2',
    color: null,
    isHidden: false,
    tooltip: null,
    image: null,
    score: null,
    value: 2,
  },
  {
    id: '37269e0e-9220-4c53-b3e6-86ec70c6a1d3',
    text: '3',
    color: null,
    isHidden: false,
    tooltip: 'Hello',
    image: null,
    score: null,
    value: 3,
  },
];

describe('Test CheckBoxActivityItem', () => {
  it('Should render initial state when nothing is checked', () => {
    const config = {
      options: options,
      randomizeOptions: false,
      addTooltip: false,
      setPalette: false,
      setAlerts: false,
      isGridView: false,
    };

    const { getAllByRole } = render(
      <TamaguiProvider>
        <CheckBoxActivityItem
          config={config}
          onChange={jest.fn()}
          values={[]}
          textReplacer={jest.fn()}
        />
      </TamaguiProvider>,
    );

    const checkboxes = getAllByRole('checkbox');
    const checkedCheckboxes = checkboxes.filter(
      cb => cb.props.accessibilityState.checked,
    );

    expect(checkboxes.length).toBe(3);
    expect(checkedCheckboxes.length).toBe(0);
  });

  it('Should render when 2 checkboxes checked', () => {
    const config = {
      options: options,
      randomizeOptions: false,
      addTooltip: false,
      setPalette: false,
      setAlerts: false,
      isGridView: false,
    };
    const { getAllByRole } = render(
      <TamaguiProvider>
        <CheckBoxActivityItem
          config={config}
          onChange={jest.fn()}
          values={[options[0], options[2]]}
          textReplacer={jest.fn()}
        />
      </TamaguiProvider>,
    );

    const checkboxes = getAllByRole('checkbox');
    const checkedCheckboxes = checkboxes.filter(
      cb => cb.props.accessibilityState.checked,
    );

    expect(checkboxes.length).toBe(3);
    expect(checkedCheckboxes.length).toBe(2);
  });
});
