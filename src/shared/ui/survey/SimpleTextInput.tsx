import { FC } from 'react';
import { TextInputProps } from 'react-native';

import { useTranslation } from 'react-i18next';

import { colors } from '@shared/lib';
import { Input } from '@shared/ui';

type Props = {
  onChange: (text: string) => void;
  value: string;
  config: {
    maxLength: number;
    isNumeric: boolean;
  };
} & Omit<TextInputProps, 'value' | 'onChange'>;

const SimpleTextInput: FC<Props> = ({ value, onChange, config, ...props }) => {
  const { maxLength = 50, isNumeric } = config;

  const { t } = useTranslation();

  const onChangeText = (text: string) => {
    onChange(text);
  };

  return (
    <Input
      placeholder={t('text_entry:type_placeholder')}
      placeholderTextColor={colors.mediumGrey}
      onChangeText={onChangeText}
      maxLength={Number(maxLength)}
      value={value}
      autoCorrect={false}
      multiline={false}
      mode="survey"
      keyboardType={isNumeric ? 'numeric' : 'default'}
      {...props}
    />
  );
};

export default SimpleTextInput;
