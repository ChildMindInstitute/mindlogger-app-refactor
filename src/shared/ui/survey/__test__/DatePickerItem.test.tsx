import { format } from 'date-fns';
import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import { DatePickerItem } from '@shared/ui';

describe('DatePickerItem', () => {
  it('should be rendered correctly with null value', () => {
    const datePickerComponent = renderer.create(
      <TamaguiProvider>
        <DatePickerItem value={null} onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const datePicker = datePickerComponent.root.findByProps({
      accessibilityLabel: 'date-picker',
    });

    const valueProp = format(datePicker.props.value, 'yyyy-MM-dd');
    const currentDate = format(new Date(), 'yyyy-MM-dd');

    expect(valueProp).toBe(currentDate);
  });

  it('should render correct value', () => {
    const fakeValue = '1970-01-01';
    const datePickerComponent = renderer.create(
      <TamaguiProvider>
        <DatePickerItem value={fakeValue} onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const datePicker = datePickerComponent.root.findByProps({
      accessibilityLabel: 'date-picker',
    });

    const valueProp = format(datePicker.props.value, 'yyyy-MM-dd');
    const fakeValueString = format(new Date(0), 'yyyy-MM-dd');

    expect(valueProp).toBe(fakeValueString);
  });
});
