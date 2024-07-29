import React from 'react';

import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import { LongTextInput } from '@shared/ui';

import ParagraphText from '../ParagraphText';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockImplementation(() => ({
    t: jest.fn().mockImplementation(key => key),
  })),
}));

describe('Test Paragraph Text', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders correctly with expected props', () => {
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

    longTextInput.props.onChangeText('new text');
    expect(mockOnChange).toHaveBeenCalledWith('new text');
  });

  it('Should handle maxLength and keyboardType configurations correctly', () => {
    const tree = renderer
      .create(
        <TamaguiProvider>
          <ParagraphText
            onChange={jest.fn()}
            value="test"
            config={{ maxLength: 150 }}
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
