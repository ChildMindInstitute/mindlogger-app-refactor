import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import { TimeRangeItem, DateTimePicker } from '@shared/ui';

describe('TimeRangeItem', () => {
  it('should be rendered correctly if initial value is null', () => {
    const rangeItem = renderer.create(
      <TamaguiProvider>
        <TimeRangeItem onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const datePickers = rangeItem.root.findAllByType(DateTimePicker);
    expect(datePickers.length).toBe(2);

    const currentDate = new Date().setSeconds(0, 0);
    const [startDatePicker, endDatePicker] = datePickers;
    const startValue = startDatePicker.props.value.setSeconds(0, 0);
    const endValue = endDatePicker.props.value.setSeconds(0, 0);

    expect(startValue).toBe(currentDate);
    expect(endValue).toBe(currentDate);
  });

  it('should be rendered correctly initial value specified', () => {
    const fakeValue = {
      endTime: {
        minutes: 10,
        hours: 10,
      },
      startTime: { minutes: 4, hours: 4 },
    };

    const rangeItem = renderer.create(
      <TamaguiProvider>
        <TimeRangeItem value={fakeValue} onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const datePickers = rangeItem.root.findAllByType(DateTimePicker);
    const [startDatePicker, endDatePicker] = datePickers;

    const startValueMinutes = startDatePicker.props.value.getMinutes();
    const startValueHours = startDatePicker.props.value.getHours();
    const endValueMinutes = endDatePicker.props.value.getMinutes();
    const endValueHours = endDatePicker.props.value.getHours();

    expect(startValueMinutes).toBe(fakeValue.startTime.minutes);
    expect(startValueHours).toBe(fakeValue.startTime.hours);
    expect(endValueMinutes).toBe(fakeValue.endTime.minutes);
    expect(endValueHours).toBe(fakeValue.endTime.hours);
  });
});
