import { render } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import { SimpleTextInput } from '../SimpleTextInput';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockImplementation(() => ({
    t: jest.fn().mockImplementation((key: string) => key),
  })),
}));

describe('Test SimpleTextInput', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be rendered with expected props', () => {
    const mockValue = '1234';

    const textInput = render(
      <TamaguiProvider>
        <SimpleTextInput
          onChange={jest.fn()}
          value={mockValue}
          config={{
            maxLength: 300,
            isNumeric: true,
          }}
        />
      </TamaguiProvider>,
    );

    expect(textInput.root.props.placeholder).toBe(
      'text_entry:type_placeholder',
    );

    expect(textInput.root.props.value).toBe('1234');

    expect(textInput.root.props.keyboardType).toBe('numeric');
  });
});
