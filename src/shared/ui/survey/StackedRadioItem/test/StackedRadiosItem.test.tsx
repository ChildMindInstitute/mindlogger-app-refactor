import { CachedImage } from '@georstat/react-native-image-cache';
import { RadioGroup } from '@tamagui/radio-group';
import { render } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import { radiosConfig, radiosValues } from './mockData';
import { StackedRadios } from '../StackedRadiosItem';

describe('StackedRadiosItem', () => {
  it('should render correct radios count', () => {
    const changeHandler = jest.fn();
    const stackedRadios = render(
      <TamaguiProvider>
        <StackedRadios
          config={radiosConfig}
          values={[]}
          onChange={changeHandler}
          tooltipsShown={false}
          textReplacer={text => text}
        />
      </TamaguiProvider>,
    );

    const radios = stackedRadios.root.findAllByType(RadioGroup.Item);

    expect(radios.length).toBe(9);
  });

  it('should render correct radios values', () => {
    const changeHandler = jest.fn();
    const stackedRadios = render(
      <TamaguiProvider>
        <StackedRadios
          config={radiosConfig}
          values={radiosValues}
          onChange={changeHandler}
          tooltipsShown={false}
          textReplacer={text => text}
        />
      </TamaguiProvider>,
    );

    const radios = stackedRadios.root.findAllByType(RadioGroup.Item);

    expect(radios.length).toBe(9);

    const filteredRadiosValues = radios.filter(radio =>
      radiosValues.find(
        value =>
          radio.props['data-test'] ===
          `stack-radio-item-${value.id}-${value.rowId}`,
      ),
    );

    expect(filteredRadiosValues.length).toBe(3);
  });

  it('should render row images', () => {
    const changeHandler = jest.fn();
    const stackedRadios = render(
      <TamaguiProvider>
        <StackedRadios
          config={radiosConfig}
          values={[]}
          onChange={changeHandler}
          tooltipsShown={false}
          textReplacer={text => text}
        />
      </TamaguiProvider>,
    );

    const radioImages = stackedRadios.root.findAllByType(CachedImage);

    expect(radioImages.length).toBe(2);
  });
});
