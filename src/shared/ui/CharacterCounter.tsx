import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Text } from '@shared/ui';

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
    <Text
      style={[
        styles.CharacterCounterText,
        {
          fontSize,
          color: focused ? colors.primary : colors.grey4,
        },
      ]}
    >
      {numberOfCharacters}/{limit} {t('character_counter:characters')}
    </Text>
  );
};
const styles = StyleSheet.create({
  CharacterCounterText: {
    padding: 2,
    margin: 2,
    marginRight: 10,
    fontWeight: '400',
  },
});

export default CharacterCounter;
