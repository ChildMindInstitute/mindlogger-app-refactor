import renderer from 'react-test-renderer';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import { DatePickerItem } from '../DatePickerItem';

describe('Test DatePickerItem', () => {
  it('Should render a MM/DD/YYYY placeholder when value is null', () => {
    const datePickerComponent = renderer.create(
      <TamaguiProvider>
        <DatePickerItem value={null} onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const datePicker = datePickerComponent.root.findByProps({
      accessibilityLabel: 'date-picker',
    });

    const placeholder = datePicker.props.placeholder as string;
    const expected = 'MM/DD/YYYY';

    expect(placeholder).toBe(expected);
  });

  it('Should consume new Date(1970, 0, 1) when props value is "1970-01-01"', () => {
    const testValue = '1970-01-01';
    const datePickerComponent = renderer.create(
      <TamaguiProvider>
        <DatePickerItem value={testValue} onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const datePicker = datePickerComponent.root.findByProps({
      accessibilityLabel: 'date-picker',
    });

    const resultDate = datePicker.props.value as Date;

    expect(resultDate).toEqual(new Date(1970, 0, 1));
  });

  it('Should consume new Date(2010, 5, 8) when props value is "2010-06-08"', () => {
    const testValue = '2010-06-08';
    const datePickerComponent = renderer.create(
      <TamaguiProvider>
        <DatePickerItem value={testValue} onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const datePicker = datePickerComponent.root.findByProps({
      accessibilityLabel: 'date-picker',
    });

    const resultDate = datePicker.props.value as Date;

    expect(resultDate).toEqual(new Date(2010, 5, 8));
  });
});
