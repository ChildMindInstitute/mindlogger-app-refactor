import { format } from 'date-fns';
import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import { DatePickerItem } from '@shared/ui';

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

  it('Should render new Date(0) when value is 1970-01-01', () => {
    const testValue = '1970-01-01';
    const datePickerComponent = renderer.create(
      <TamaguiProvider>
        <DatePickerItem value={testValue} onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const datePicker = datePickerComponent.root.findByProps({
      accessibilityLabel: 'date-picker',
    });

    const resultProp = format(datePicker.props.value, 'yyyy-MM-dd');

    const expectedDate = format(new Date(0), 'yyyy-MM-dd');

    expect(resultProp).toBe(expectedDate);
  });
});
