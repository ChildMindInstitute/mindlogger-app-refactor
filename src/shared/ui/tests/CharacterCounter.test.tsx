import React from 'react';

import { render } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { colors } from '@app/shared/lib/constants/colors';

import { CharacterCounter } from '../CharacterCounter';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn((key, options) => {
      if (key === 'character_counter:characters') {
        return `${options.numberOfCharacters}/${options.limit} characters`;
      }
      return key;
    }),
  }),
}));

describe('CharacterCounter Component', () => {
  it('Should apply the primary color when focused', () => {
    const { getByText } = render(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={10} limit={20} focused={true} />
      </TamaguiProvider>,
    );

    const element = getByText('10/20 characters');
    expect(element).toBeTruthy();
    expect(element.props.style).toEqual(
      expect.objectContaining({ color: colors.primary }),
    );
  });

  it('Should apply the grey color when not focused', () => {
    const { getByText } = render(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={10} limit={20} focused={false} />
      </TamaguiProvider>,
    );

    const element = getByText('10/20 characters');
    expect(element.props.style).toEqual(
      expect.objectContaining({ color: colors.grey4 }),
    );
  });

  it('Should display the correct character count', () => {
    const { getByText } = render(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={150} limit={200} />
      </TamaguiProvider>,
    );

    expect(getByText('150/200 characters')).toBeTruthy();
  });

  it('Should handle extreme values correctly', () => {
    const { getByText } = render(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={9999} limit={10000} />
      </TamaguiProvider>,
    );

    expect(getByText('9999/10000 characters')).toBeTruthy();
  });

  it('Should handle missing translation key gracefully', () => {
    jest
      .spyOn(useTranslation(), 't')
      .mockImplementation(() => 'Translation missing');

    const { getByText } = render(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={50} limit={100} />
      </TamaguiProvider>,
    );

    expect(getByText('50/100 characters')).toBeTruthy();
  });

  it('Should apply custom styles from the stylesheet', () => {
    const { getByText } = render(
      <TamaguiProvider>
        <CharacterCounter numberOfCharacters={25} limit={50} />
      </TamaguiProvider>,
    );

    const element = getByText('25/50 characters');
    expect(element.props.style).toEqual(
      expect.objectContaining({ padding: 2, margin: 2, marginRight: 10 }),
    );
  });
});
