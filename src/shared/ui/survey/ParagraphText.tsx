import React, { FC, useState } from 'react';
import { StyleSheet, TextInputProps, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { colors } from '@shared/lib';
import { LongTextInput, CharacterCounter } from '@shared/ui';

type Props = {
  onChange: (text: string) => void;
  value: string;
  config: {
    maxLength: number;
  };
} & Omit<TextInputProps, 'value' | 'onChange'>;

const ParagraphText: FC<Props> = ({ value, onChange, config, ...props }) => {
  const [paragraphOnFocus, setParagraphOnFocus] = useState(false);
  const { maxLength = 50 } = config;
  const { t } = useTranslation();

  const onChangeText = (text: string) => {
    onChange(text);
  };

  return (
    <View style={styles.container}>
      <LongTextInput
        accessibilityLabel="paragraph-item"
        placeholder={t('text_entry:paragraph_placeholder')}
        placeholderTextColor={colors.mediumGrey}
        onChangeText={onChangeText}
        maxLength={maxLength}
        value={value}
        autoCorrect={false}
        multiline={true}
        keyboardType={'default'}
        onFocus={() => setParagraphOnFocus(true)}
        onBlur={() => setParagraphOnFocus(false)}
        {...props}
      />
      <CharacterCounter
        focused={paragraphOnFocus}
        limit={maxLength}
        numberOfCharacters={value.length}
      />
    </View>
  );
};

export default ParagraphText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
