import React, { FC } from 'react';

import CharacterCounterText from '../CharacterCounterText';
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
  return (
    <CharacterCounterText
      color={focused ? 'primary' : 'grey4'}
      fontSize={fontSize}
    >
      {numberOfCharacters}/{limit} characters
    </CharacterCounterText>
  );
};

export default CharacterCounter;
