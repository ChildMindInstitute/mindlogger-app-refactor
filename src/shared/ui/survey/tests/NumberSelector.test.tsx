import { render } from '@testing-library/react-native';
import { ReactTestInstance } from 'react-test-renderer';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import { NumberSelector } from '../NumberSelector';

// This type may be deprecated, but it is still used by react native testing library

jest.mock(
  'react-native-select-dropdown',
  () =>
    function () {
      return <></>;
    },
);

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockReturnValue({
    t: jest.fn().mockImplementation((key: string) => key),
  }),
}));

describe('Test NumberSelector', () => {
  it('Should render 4 dropdown items', () => {
    const selector = render(
      <TamaguiProvider>
        <NumberSelector
          config={{ min: 1, max: 4 }}
          value={'2'}
          onChange={jest.fn()}
        />
      </TamaguiProvider>,
    );

    const children = selector.root.children;
    expect(children.length).toBe(1);

    const dropdown = children[0] as ReactTestInstance;
    const dropdownItemsLength = dropdown.props.data.length;

    expect(dropdownItemsLength).toBe(4);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
