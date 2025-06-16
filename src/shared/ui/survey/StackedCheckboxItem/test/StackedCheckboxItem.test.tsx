import { CachedImage } from '@georstat/react-native-image-cache';
import { render } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import { selectedValues, stackedCheckboxConfig } from './mockData';
import { StackedCheckboxItem } from '../StackedCheckboxItem';

describe('StackedCheckboxItem', () => {
  it('should render correct checkbox count', () => {
    const changeHandler = jest.fn();
    const textReplacer = jest.fn();
    const { getAllByRole } = render(
      <TamaguiProvider>
        <StackedCheckboxItem
          values={null}
          onChange={changeHandler}
          config={stackedCheckboxConfig}
          textReplacer={textReplacer}
          tooltipsShown={false}
        />
      </TamaguiProvider>,
    );

    const checkboxes = getAllByRole('checkbox');

    expect(checkboxes.length).toBe(9);
  });

  it('should render correct selected checkboxes', () => {
    const changeHandler = jest.fn();
    const textReplacer = jest.fn();
    const { getAllByRole } = render(
      <TamaguiProvider>
        <StackedCheckboxItem
          values={selectedValues}
          onChange={changeHandler}
          config={stackedCheckboxConfig}
          textReplacer={textReplacer}
          tooltipsShown={false}
        />
      </TamaguiProvider>,
    );

    const checkboxes = getAllByRole('checkbox');

    const selectedCheckboxes = checkboxes.filter(
      checkbox => checkbox.props.accessibilityState.checked,
    );

    expect(selectedCheckboxes.length).toBe(2);
  });

  it('should render option images', () => {
    const changeHandler = jest.fn();
    const textReplacer = jest.fn();
    const stackedCheckbox = render(
      <TamaguiProvider>
        <StackedCheckboxItem
          values={selectedValues}
          onChange={changeHandler}
          config={stackedCheckboxConfig}
          textReplacer={textReplacer}
          tooltipsShown={false}
        />
      </TamaguiProvider>,
    );

    const checkboxImages = stackedCheckbox.root.findAllByType(CachedImage);

    expect(checkboxImages.length).toBe(2);
  });
});
