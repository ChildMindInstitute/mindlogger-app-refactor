import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import * as dateTimeUtils from '@shared/lib/utils/dateTime';
import { TimeRangeItem, DateTimePicker } from '@shared/ui';

describe('Test TimeRangeItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render start/end date pickers if initial value passed as undefined', () => {
    const mockNowDate = new Date(2024, 3, 8, 14, 15, 16);

    jest.spyOn(dateTimeUtils, 'getNow').mockReturnValue(mockNowDate);

    const rangeItem = renderer.create(
      <TamaguiProvider>
        <TimeRangeItem onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const datePickers = rangeItem.root.findAllByType(DateTimePicker);

    expect(datePickers.length).toBe(2);

    const [startDatePicker, endDatePicker] = datePickers;

    const startDateValue = startDatePicker.props.value;

    const endDateValue = endDatePicker.props.value;

    expect(startDateValue).toBe(mockNowDate);

    expect(endDateValue).toBe(mockNowDate);
  });

  it('Should render start/end date pickers if initial value specified', () => {
    const mockNowDate = new Date(2024, 3, 8, 14, 15, 16);

    jest.spyOn(dateTimeUtils, 'getNow').mockReturnValue(mockNowDate);

    const mockValue = {
      endTime: {
        minutes: 10,
        hours: 10,
      },
      startTime: { minutes: 4, hours: 4 },
    };

    const rangeItem = renderer.create(
      <TamaguiProvider>
        <TimeRangeItem value={mockValue} onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const datePickers = rangeItem.root.findAllByType(DateTimePicker);

    const [startDatePicker, endDatePicker] = datePickers;

    const startDateValue = startDatePicker.props.value;

    const endDateValue = endDatePicker.props.value;

    const expectedStartValue = new Date(mockNowDate);
    expectedStartValue.setHours(4);
    expectedStartValue.setMinutes(4);
    expectedStartValue.setSeconds(0, 0);

    const expectedEndValue = new Date(mockNowDate);
    expectedEndValue.setHours(10);
    expectedEndValue.setMinutes(10);
    expectedEndValue.setSeconds(0, 0);

    expect(startDateValue).toEqual(expectedStartValue);

    expect(endDateValue).toEqual(expectedEndValue);
  });
});
