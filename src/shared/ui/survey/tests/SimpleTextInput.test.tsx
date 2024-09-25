import { TextInput } from 'react-native';

import renderer from 'react-test-renderer';

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

    const textInput = renderer.create(
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

    const textField = textInput.root.findByType(TextInput);

    expect(textField.props.placeholder).toBe('text_entry:type_placeholder');

    expect(textField.props.value).toBe('1234');

    expect(textField.props.keyboardType).toBe('numeric');
  });
});
