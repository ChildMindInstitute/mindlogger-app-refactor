import React from 'react';
import { Text } from 'react-native';

import { fireEvent, render } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import { ParagraphText } from '../ParagraphText';

jest.mock('../../CharacterCounter', () => ({
  CharacterCounter: ({ focused, numberOfCharacters, limit }: any) => (
    <Text
      testID="character-counter"
      data-focused={focused}
      data-numberOfCharacters={numberOfCharacters}
      data-limit={limit}
    >
      Mocked CharacterCounter
    </Text>
  ),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockImplementation(() => ({
    t: jest.fn().mockImplementation(key => key),
  })),
}));

describe('ParagraphText Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render correctly with expected props', () => {
    const mockValue = '1234';

    const { getByPlaceholderText } = render(
      <TamaguiProvider>
        <ParagraphText
          onChange={jest.fn()}
          value={mockValue}
          config={{
            maxLength: 300,
          }}
        />
      </TamaguiProvider>,
    );

    const input = getByPlaceholderText('text_entry:paragraph_placeholder');

    expect(input.props.value).toBe(mockValue);
  });

  it('Should call onChange when text is modified', () => {
    const mockOnChange = jest.fn();

    const { getByPlaceholderText } = render(
      <TamaguiProvider>
        <ParagraphText
          onChange={mockOnChange}
          value="test"
          config={{ maxLength: 300 }}
        />
      </TamaguiProvider>,
    );

    const input = getByPlaceholderText('text_entry:paragraph_placeholder');
    fireEvent.changeText(input, 'new text');
    expect(mockOnChange).toHaveBeenCalledWith('new text');
  });

  it('Should update focus state when input is focused or blurred', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <TamaguiProvider>
        <ParagraphText
          onChange={jest.fn()}
          value="test"
          config={{ maxLength: 300 }}
        />
      </TamaguiProvider>,
    );

    const input = getByPlaceholderText('text_entry:paragraph_placeholder');
    const characterCounter = getByTestId('character-counter');

    expect(characterCounter.props['data-focused']).toBe(false);

    fireEvent(input, 'focus');
    expect(characterCounter.props['data-focused']).toBe(true);

    fireEvent(input, 'blur');
    expect(characterCounter.props['data-focused']).toBe(false);
  });

  it('Should pass correct number of characters and maxLength to CharacterCounter', () => {
    const mockValue = '123456';
    const maxLength = 100;

    const { getByTestId } = render(
      <TamaguiProvider>
        <ParagraphText
          onChange={jest.fn()}
          value={mockValue}
          config={{ maxLength }}
        />
      </TamaguiProvider>,
    );

    const characterCounter = getByTestId('character-counter');
    expect(characterCounter.props['data-numberOfCharacters']).toBe(
      mockValue.length,
    );
    expect(characterCounter.props['data-limit']).toBe(maxLength);
  });
});
