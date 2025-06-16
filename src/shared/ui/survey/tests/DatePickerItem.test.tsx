import { render } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import { DatePickerItem } from '../DatePickerItem';

describe('Test DatePickerItem', () => {
  it('Should render a MM/DD/YYYY placeholder when value is null', () => {
    const { getByText } = render(
      <TamaguiProvider>
        <DatePickerItem value={null} onChange={jest.fn()} />
      </TamaguiProvider>,
    );
    
    const placeholder = getByText('MM/DD/YYYY');
    expect(placeholder).toBeTruthy();
  });

  it('Should render the proper date value when provided', () => {
    const testValue = '1970-01-01';
    const { queryByText } = render(
      <TamaguiProvider>
        <DatePickerItem value={testValue} onChange={jest.fn()} />
      </TamaguiProvider>,
    );
    
    const dateText = queryByText('January 1, 1970');
    expect(dateText).not.toBeNull();
  });
});
