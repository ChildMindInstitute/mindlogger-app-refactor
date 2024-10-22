import { CachedImage } from '@georstat/react-native-image-cache';
import renderer from 'react-test-renderer';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { CheckBox } from '@app/shared/ui/CheckBox';

import { selectedValues, stackedCheckboxConfig } from './mockData';
import { StackedCheckboxItem } from '../StackedCheckboxItem';

describe('StackedCheckboxItem', () => {
  it('should render correct checkbox count', () => {
    const changeHandler = jest.fn();
    const textReplacer = jest.fn();
    const stackedCheckbox = renderer.create(
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

    const checkboxes = stackedCheckbox.root.findAllByType(CheckBox);

    expect(checkboxes.length).toBe(9);
  });

  it('should render correct selected checkboxes', () => {
    const changeHandler = jest.fn();
    const textReplacer = jest.fn();
    const stackedCheckbox = renderer.create(
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

    const checkboxes = stackedCheckbox.root.findAllByType(CheckBox);

    const selectedCheckboxes = checkboxes.filter(
      checkbox => checkbox.props.value,
    );

    expect(selectedCheckboxes.length).toBe(2);
  });

  it('should render option images', () => {
    const changeHandler = jest.fn();
    const textReplacer = jest.fn();
    const stackedCheckbox = renderer.create(
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
