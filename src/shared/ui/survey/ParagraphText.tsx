import React, { FC, useState } from 'react';
import { StyleSheet, TextInputProps, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { CharacterCounter } from '../CharacterCounter';
import { LongTextInput } from '../LongTextInput';

type Props = {
  onChange: (text: string) => void;
  value: string;
  config: {
    maxLength: number;
  };
} & Omit<TextInputProps, 'value' | 'onChange'>;

export const ParagraphText: FC<Props> = ({
  value,
  onChange,
  config,
  ...props
}) => {
  const [paragraphOnFocus, setParagraphOnFocus] = useState(false);
  const { maxLength = 50 } = config;
  const { t } = useTranslation();

  const onChangeText = (text: string) => {
    onChange(text);
  };

  return (
    <View style={styles.container}>
      <LongTextInput
        aria-label="paragraph-item"
        placeholder={t('text_entry:paragraph_placeholder')}
        onChangeText={onChangeText}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
