import { render } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { HourMinute } from '@app/shared/lib/types/dateTime';
import * as dateTimeUtils from '@shared/lib/utils/dateTime';

import { TimePickerItem } from '../TimePickerItem';
import { TIME_PICKER_FORMAT_PLACEHOLDER } from '@shared/lib/constants/dateTime.ts';

describe('Test TimePickerItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be rendered with the value equal to undefined', () => {
    const mockNowDate = new Date(2024, 3, 8, 14, 15, 16);

    jest.spyOn(dateTimeUtils, 'getNow').mockReturnValue(mockNowDate);

    const { queryByText } = render(
      <TamaguiProvider>
        <TimePickerItem onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const pickerValue = queryByText(TIME_PICKER_FORMAT_PLACEHOLDER);

    expect(pickerValue).not.toBeNull();
  });

  it('Should be rendered with the specified value', () => {
    const mockNowDate = new Date(2023, 1, 5, 16, 5, 18);

    jest.spyOn(dateTimeUtils, 'getNow').mockReturnValue(mockNowDate);

    const mockValue: HourMinute = {
      minutes: 3,
      hours: 2,
    };

    const { queryByText } = render(
      <TamaguiProvider>
        <TimePickerItem value={mockValue} onChange={jest.fn()} />
      </TamaguiProvider>,
    );

    const pickerValue = queryByText('02:03 AM');
    expect(pickerValue).not.toBeNull();
  });
});
