import React, { FC, useState } from 'react';
import {
  StyleSheet,
  TextInputProps,
  View,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import { colors } from '@shared/lib';
import { LongTextInput } from '@shared/ui';

type Props = {
  onChange: (text: string) => void;
  value: string;
  config: {
    maxLength: number;
  };
} & Omit<TextInputProps, 'value' | 'onChange'>;

const ParagraphText: FC<Props> = ({ value, onChange, config, ...props }) => {
  const { maxLength = 50 } = config;
  const { t } = useTranslation();

  const [inputHeight, setInputHeight] = useState(56);

  const onChangeText = (text: string) => {
    onChange(text);
  };

  const handleContentSizeChange = (
    contentWidth: number,
    contentHeight: number,
  ) => {
    setInputHeight(contentHeight);
  };

  const handleContentSizeChangeWrapper = (
    event: NativeSyntheticEvent<
      | {
          contentWidth: number;
          contentHeight: number;
        }
      | TextInputContentSizeChangeEventData
    >,
  ) => {
    const { contentWidth, contentHeight } = event.nativeEvent as {
      contentWidth: number;
      contentHeight: number;
    };
    handleContentSizeChange(contentWidth, contentHeight);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    input: {
      height: inputHeight,
    },
  });

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
        style={styles.input}
        onContentSizeChange={handleContentSizeChangeWrapper}
        {...props}
      />
    </View>
  );
};

export default ParagraphText;
