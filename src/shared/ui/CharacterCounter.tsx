import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { CharacterCounterText } from '@shared/ui';

import { colors } from '../lib';

type Props = {
  limit: number | string;
  numberOfCharacters: number | string;
  fontSize?: number;
  focused?: boolean;
};

const CharacterCounter: FC<Props> = ({
  numberOfCharacters,
  limit,
  fontSize = 14,
  focused = false,
}) => {
  const { t } = useTranslation();

  return (
    <CharacterCounterText
      style={{
        fontSize,
        color: focused ? colors.primary : colors.grey4,
      }}
    >
      {numberOfCharacters}/{limit} {t('character_counter:characters')}
    </CharacterCounterText>
  );
};

export default CharacterCounter;
