import React from 'react';

import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import { LongTextInput } from '@shared/ui';

import TextParagraph from '../TextParagraph';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockImplementation(() => ({
    t: jest.fn().mockImplementation(key => key),
  })),
}));

describe('TextParagraph Component Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with expected props', () => {
    const mockValue = '1234';

    const tree = renderer
      .create(
        <TamaguiProvider>
          <TextParagraph
            onChange={jest.fn()}
            value={mockValue}
            config={{
              maxLength: 300,
              isNumeric: true,
            }}
          />
        </TamaguiProvider>,
      )
      .toJSON();

    if (!tree || Array.isArray(tree)) {
      throw new Error('Tree is not rendered correctly or is an array');
    }

    const view = tree as any;
    const longTextInput = view.children[0];

    expect(longTextInput.props.placeholder).toBe(
      'text_entry:paragraph_placeholder',
    );
    expect(longTextInput.props.value).toBe('1234');
    expect(longTextInput.props.keyboardType).toBe('numeric');
    expect(longTextInput.props.maxLength).toBe(300);
  });

  it('calls onChange when text is modified', () => {
    const mockOnChange = jest.fn();

    const tree = renderer.create(
      <TamaguiProvider>
        <TextParagraph
          onChange={mockOnChange}
          value="test"
          config={{ maxLength: 300, isNumeric: false }}
        />
      </TamaguiProvider>,
    );

    const instance = tree.root;
    const longTextInput = instance.findByType(LongTextInput);

    longTextInput.props.onChangeText('new text');
    expect(mockOnChange).toHaveBeenCalledWith('new text');
  });

  it('handles maxLength and keyboardType configurations correctly', () => {
    const tree = renderer
      .create(
        <TamaguiProvider>
          <TextParagraph
            onChange={jest.fn()}
            value="test"
            config={{ maxLength: 150, isNumeric: true }}
          />
        </TamaguiProvider>,
      )
      .toJSON();

    if (!tree || Array.isArray(tree)) {
      throw new Error('Tree is not rendered correctly or is an array');
    }

    const view = tree as any;
    const longTextInput = view.children[0];

    expect(longTextInput.props.maxLength).toBe(150);
    expect(longTextInput.props.keyboardType).toBe('numeric');
  });
});
