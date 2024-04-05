import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import { HourMinute } from '@app/shared/lib';
import * as dateTimeUtils from '@shared/lib/utils/dateTime';

import TimePickerItem from '../TimePickerItem';

describe('Test TimePickerItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be rendered with the value equal to undefined', () => {
    const mockNowDate = new Date(2024, 3, 8, 14, 15, 16);

    const mockMinutes = mockNowDate.getMinutes();

    jest.spyOn(dateTimeUtils, 'getNow').mockReturnValue(mockNowDate);

    const timePicker = renderer.create(
      <TamaguiProvider>
        <TimePickerItem onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const pickerButton = timePicker.root.findByProps({
      accessibilityLabel: 'time-picker',
    });

    const pickerValueDate = new Date(pickerButton.props.value);

    const pickerValueMinutes = pickerValueDate.getMinutes();

    expect(pickerValueMinutes).toBe(mockMinutes);
  });

  it('Should be rendered with the specified value', () => {
    const mockNowDate = new Date(2023, 1, 5, 16, 5, 18);

    jest.spyOn(dateTimeUtils, 'getNow').mockReturnValue(mockNowDate);

    const mockValue: HourMinute = {
      minutes: 3,
      hours: 2,
    };

    const timePicker = renderer.create(
      <TamaguiProvider>
        <TimePickerItem value={mockValue} onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const pickerButton = timePicker.root.findByProps({
      accessibilityLabel: 'time-picker',
    });

    const pickerValue: Date = pickerButton.props.value;

    const expected = new Date(mockNowDate);
    expected.setHours(2);
    expected.setMinutes(3);
    expected.setSeconds(0);

    expect(pickerValue).toEqual(expected);
  });
});
