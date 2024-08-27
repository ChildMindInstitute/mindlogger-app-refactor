import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Text } from '@shared/ui';

import { colors } from '../lib';

type Props = {
  limit: number;
  numberOfCharacters: number;
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
  let colorStyle = focused ? styles.focusedColor : styles.unfocusedColor;

  if (limit < numberOfCharacters) colorStyle = styles.WarnColor;

  return (
    <Text style={[styles.CharacterCounterText, colorStyle, { fontSize }]}>
      {t('character_counter:characters', { numberOfCharacters, limit })}
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
  focusedColor: {
    color: colors.primary,
  },
  unfocusedColor: {
    color: colors.grey4,
  },
  WarnColor: {
    color: colors.errorRed,
  },
});

export default CharacterCounter;
