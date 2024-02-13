import { CachedImage } from '@georstat/react-native-image-cache';
import { RadioGroup } from '@tamagui/radio-group';
import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';

import mock from './mockData';
import StackedRadiosItem from '../StackedRadiosItem';

jest.mock('@app/shared/lib/constants', () => ({
  ...jest.requireActual('@app/shared/lib/constants'),
  STORE_ENCRYPTION_KEY: '12345',
}));

describe('StackedRadiosItem', () => {
  it('should render correct radios count', () => {
    const changeHandler = jest.fn();
    const stackedRadios = renderer.create(
      <TamaguiProvider>
        <StackedRadiosItem
          config={mock.radiosConfig}
          values={[]}
          onChange={changeHandler}
          tooltipsShown={false}
          textReplacer={(text) => text}
        />
      </TamaguiProvider>,
    );

    const radios = stackedRadios.root.findAllByType(RadioGroup.Item);

    expect(radios.length).toBe(9);
  });

  it('should render correct radios values', () => {
    const changeHandler = jest.fn();
    const stackedRadios = renderer.create(
      <TamaguiProvider>
        <StackedRadiosItem
          config={mock.radiosConfig}
          values={mock.radiosValues}
          onChange={changeHandler}
          tooltipsShown={false}
          textReplacer={(text) => text}
        />
      </TamaguiProvider>,
    );

    const radios = stackedRadios.root.findAllByType(RadioGroup.Item);

    expect(radios.length).toBe(9);

    const radiosValues = radios.filter((radio) =>
      mock.radiosValues.find(
        (value) =>
          radio.props['data-test'] ===
          `stack-radio-item-${value.id}-${value.rowId}`,
      ),
    );

    expect(radiosValues.length).toBe(3);
  });

  it('should render row images', () => {
    const changeHandler = jest.fn();
    const stackedRadios = renderer.create(
      <TamaguiProvider>
        <StackedRadiosItem
          config={mock.radiosConfig}
          values={[]}
          onChange={changeHandler}
          tooltipsShown={false}
          textReplacer={(text) => text}
        />
      </TamaguiProvider>,
    );

    const radioImages = stackedRadios.root.findAllByType(CachedImage);

    expect(radioImages.length).toBe(2);
  });
});
