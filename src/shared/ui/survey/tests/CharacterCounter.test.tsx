import React from 'react';

import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';

import CharacterCounterText from '../../CharacterCounterText';
import CharacterCounter from '../CharacterCounter';

describe('CharacterCounter Component', () => {
  it('Should renders correctly with default props', () => {
    const tree = renderer
      .create(
        <TamaguiProvider>
          <CharacterCounter numberOfCharacters={50} limit={100} />
        </TamaguiProvider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Should apply the correct font size', () => {
    const tree = renderer.create(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={25} limit={50} fontSize={20} />
      </TamaguiProvider>,
    );

    const textElement = tree.root.findByType(CharacterCounterText);
    expect(textElement.props.fontSize).toBe(20);
  });

  it('Should apply the primary color when focused', () => {
    const tree = renderer.create(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={10} limit={20} focused={true} />
      </TamaguiProvider>,
    );

    const textElement = tree.root.findByType(CharacterCounterText);
    expect(textElement.props.color).toBe('primary');
  });

  it('Should apply the grey color when not focused', () => {
    const tree = renderer.create(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={10} limit={20} focused={false} />
      </TamaguiProvider>,
    );

    const textElement = tree.root.findByType(CharacterCounterText);
    expect(textElement.props.color).toBe('grey4');
  });

  it('Should display the correct character count', () => {
    const tree = renderer.create(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={150} limit={200} />
      </TamaguiProvider>,
    );

    const textElement = tree.root.findByType(CharacterCounterText);

    const characterCountText = Array.isArray(textElement.props.children)
      ? textElement.props.children.join('')
      : textElement.props.children;

    expect(characterCountText).toBe('150/200 characters');
  });
});
