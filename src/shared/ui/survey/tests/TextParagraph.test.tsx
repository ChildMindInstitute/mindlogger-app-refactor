import React from 'react';

import renderer, { act } from 'react-test-renderer';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import { CharacterCounter } from '../../CharacterCounter';
import { LongTextInput } from '../../LongTextInput';
import { ParagraphText } from '../ParagraphText';

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

    const tree = renderer
      .create(
        <TamaguiProvider>
          <ParagraphText
            onChange={jest.fn()}
            value={mockValue}
            config={{
              maxLength: 300,
            }}
          />
        </TamaguiProvider>,
      )
      .toJSON();

    if (!tree || Array.isArray(tree) || !tree.children) {
      throw new Error(
        'Tree is not rendered correctly or is an array without children',
      );
    }

    const [longTextInput] = tree.children;

    if (
      !longTextInput ||
      typeof longTextInput !== 'object' ||
      !('props' in longTextInput)
    ) {
      throw new Error('LongTextInput is not rendered correctly');
    }

    expect(longTextInput.props.placeholder).toBe(
      'text_entry:paragraph_placeholder',
    );
    expect(longTextInput.props.value).toBe(mockValue);
  });

  it('Should call onChange when text is modified', () => {
    const mockOnChange = jest.fn();
    const tree = renderer.create(
      <TamaguiProvider>
        <ParagraphText
          onChange={mockOnChange}
          value="test"
          config={{ maxLength: 300 }}
        />
      </TamaguiProvider>,
    );

    const instance = tree.root;
    const longTextInput = instance.findByType(LongTextInput);

    act(() => {
      longTextInput.props.onChangeText('new text');
    });

    expect(mockOnChange).toHaveBeenCalledWith('new text');
  });

  it('Should update focus state when input is focused or blurred', () => {
    const tree = renderer.create(
      <TamaguiProvider>
        <ParagraphText
          onChange={jest.fn()}
          value="test"
          config={{ maxLength: 300 }}
        />
      </TamaguiProvider>,
    );

    const instance = tree.root;
    const longTextInput = instance.findByType(LongTextInput);
    const characterCounter = instance.findByType(CharacterCounter);

    expect(characterCounter.props.focused).toBe(false);

    act(() => {
      longTextInput.props.onFocus();
    });

    expect(characterCounter.props.focused).toBe(true);

    act(() => {
      longTextInput.props.onBlur();
    });

    expect(characterCounter.props.focused).toBe(false);
  });

  it('Should pass correct number of characters and maxLength to CharacterCounter', () => {
    const mockValue = '123456';
    const maxLength = 100;

    const tree = renderer.create(
      <TamaguiProvider>
        <ParagraphText
          onChange={jest.fn()}
          value={mockValue}
          config={{ maxLength }}
        />
      </TamaguiProvider>,
    );

    const instance = tree.root;
    const characterCounter = instance.findByType(CharacterCounter);
    expect(characterCounter.props.numberOfCharacters).toBe(mockValue.length);
    expect(characterCounter.props.limit).toBe(maxLength);
  });
});
