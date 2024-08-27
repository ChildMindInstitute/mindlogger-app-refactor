import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Logger } from '@app/shared/lib';
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
  focused = false,
}) => {
  const { t } = useTranslation();
  let colorStyle = focused ? styles.focusedColor : styles.unfocusedColor;

  if (limit < numberOfCharacters) colorStyle = styles.WarnColor;

  if (!limit || limit <= 0) {
    Logger.error('[CharacterCounter] Limit should be higher than 0');
    return null;
  }

  if (numberOfCharacters < 0) {
    Logger.error('[CharacterCounter] numberOfCharacters Cannot be less than 0');
    return null;
  }

  return (
    <Text style={[styles.CharacterCounterText, colorStyle]}>
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
    fontSize: 14,
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
