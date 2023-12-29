import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import { getHourMinute, HourMinute } from '@app/shared/lib';

import TimePickerItem from '../TimePickerItem';

describe('TimePickerItem', () => {
  it('should be rendered correctly with null value', () => {
    const timePicker = renderer.create(
      <TamaguiProvider>
        <TimePickerItem onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const pickerButton = timePicker.root.findByProps({
      accessibilityLabel: 'time-picker',
    });

    const fakeValue = new Date();

    const fakeValueMinutes = fakeValue.getMinutes();
    const pickerValueDate = new Date(pickerButton.props.value);
    const pickerValueMinutes = pickerValueDate.getMinutes();

    expect(pickerValueMinutes).toBe(fakeValueMinutes);
  });

  it('should be rendered correctly with specified value', () => {
    const fakeValue: HourMinute = {
      minutes: 3,
      hours: 2,
    };

    const timePicker = renderer.create(
      <TamaguiProvider>
        <TimePickerItem value={fakeValue} onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const pickerButton = timePicker.root.findByProps({
      accessibilityLabel: 'time-picker',
    });

    const pickerValue = getHourMinute(pickerButton.props.value);
    const resultValue = getHourMinute(new Date(2011, 0, 1, 2, 3, 4, 567));

    expect(pickerValue.minutes).toBe(resultValue.minutes);
    expect(pickerValue.hours).toBe(resultValue.hours);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
