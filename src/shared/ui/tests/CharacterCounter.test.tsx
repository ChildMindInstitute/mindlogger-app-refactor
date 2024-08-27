import React from 'react';
import { Text } from 'react-native';

import { useTranslation } from 'react-i18next';
import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import { CharacterCounter } from '@shared/ui';

import { colors } from '../../lib';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockImplementation(() => ({
    t: jest.fn().mockImplementation(key => key),
  })),
}));

describe('CharacterCounter Component', () => {
  it('Should render correctly with default props', () => {
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

    const textElement = tree.root.findByType(Text);
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontSize: 20 })]),
    );
  });

  it('Should apply the primary color when focused', () => {
    const tree = renderer.create(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={10} limit={20} focused={true} />
      </TamaguiProvider>,
    );

    const textElement = tree.root.findByType(Text);
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: colors.primary }),
      ]),
    );
  });

  it('Should apply the grey color when not focused', () => {
    const tree = renderer.create(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={10} limit={20} focused={false} />
      </TamaguiProvider>,
    );

    const textElement = tree.root.findByType(Text);
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: colors.grey4 }),
      ]),
    );
  });

  it('Should display the correct character count', () => {
    const tree = renderer.create(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={150} limit={200} />
      </TamaguiProvider>,
    );

    const textElement = tree.root.findByType(Text);

    const characterCountText = Array.isArray(textElement.props.children)
      ? textElement.props.children.join('')
      : textElement.props.children;

    expect(characterCountText).toBe('150/200 character_counter:characters');
  });

  it('Should handle extreme values correctly', () => {
    const tree = renderer.create(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={9999} limit={10000} />
      </TamaguiProvider>,
    );

    const textElement = tree.root.findByType(Text);

    const characterCountText = Array.isArray(textElement.props.children)
      ? textElement.props.children.join('')
      : textElement.props.children;

    expect(characterCountText).toBe('9999/10000 character_counter:characters');
  });

  it('Should handle missing translation key gracefully', () => {
    jest
      .spyOn(useTranslation(), 't')
      .mockImplementation(() => 'Translation missing');

    const tree = renderer.create(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={50} limit={100} />
      </TamaguiProvider>,
    );

    const textElement = tree.root.findByType(Text);

    const characterCountText = Array.isArray(textElement.props.children)
      ? textElement.props.children.join('')
      : textElement.props.children;

    expect(characterCountText).toBe('50/100 character_counter:characters');
  });

  it('Should apply custom styles from the stylesheet', () => {
    const tree = renderer.create(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={25} limit={50} />
      </TamaguiProvider>,
    );

    const textElement = tree.root.findByType(Text);
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ padding: 2, margin: 2, marginRight: 10 }),
      ]),
    );
  });
});