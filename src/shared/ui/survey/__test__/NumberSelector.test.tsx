import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import { Dropdown, NumberSelector } from '@shared/ui';

jest.mock(
  'react-native-select-dropdown',
  () =>
    function () {
      return <></>;
    },
);

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockImplementation(() => ({
    t: jest.fn().mockImplementation((key: string) => key),
  })),
}));

describe('NumberSelector', () => {
  it('should render correct list of items', () => {
    const selector = renderer.create(
      <TamaguiProvider>
        <NumberSelector
          config={{ min: 1, max: 4 }}
          value={'2'}
          onChange={jest.fn()}
        />
      </TamaguiProvider>,
    );

    const dropdown = selector.root.findByType(Dropdown);
    const dropdownItemsLength = dropdown.props.items.length;

    expect(dropdownItemsLength).toBe(4);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
