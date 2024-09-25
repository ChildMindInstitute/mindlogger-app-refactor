import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Text } from './Text';
import { colors } from '../lib/constants/colors';
import { getDefaultLogger } from '../lib/services/loggerInstance';

type Props = {
  limit: number;
  numberOfCharacters: number;
  fontSize?: number;
  focused?: boolean;
};

export const CharacterCounter: FC<Props> = ({
  numberOfCharacters,
  limit,
  focused = false,
}) => {
  const { t } = useTranslation();
  let colorStyle = focused ? styles.focusedColor : styles.unfocusedColor;

  if (limit < numberOfCharacters) colorStyle = styles.warnColor;

  if (limit <= 0) {
    getDefaultLogger().error(
      '[CharacterCounter] Limit should be higher than 0',
    );
    return null;
  }

  if (numberOfCharacters < 0) {
    getDefaultLogger().error(
      '[CharacterCounter] numberOfCharacters Cannot be less than 0',
    );
    return null;
  }

  return (
    <Text style={[styles.characterCounterText, colorStyle]}>
      {t('character_counter:characters', { numberOfCharacters, limit })}
    </Text>
  );
};

const styles = StyleSheet.create({
  characterCounterText: {
    padding: 2,
    margin: 2,
    marginRight: 10,
    fontWeight: '400',
    fontSize: 14,
  },
  focusedColor: {
    color: colors.primary,
  },
  unfocusedColor: {
    color: colors.grey4,
  },
  warnColor: {
    color: colors.errorRed,
  },
});
