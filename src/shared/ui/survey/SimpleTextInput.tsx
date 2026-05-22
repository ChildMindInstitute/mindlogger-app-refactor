import { FC, useEffect, useState } from 'react';
import { TextInputProps } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Input } from '../Input';

type Props = {
  onChange: (text: string) => void;
  value: string;
  config: {
    maxLength: number;
    isNumeric: boolean;
  };
} & Omit<TextInputProps, 'value' | 'onChange'>;

export const SimpleTextInput: FC<Props> = ({
  value,
  onChange,
  config,
  ...props
}) => {
  const { maxLength = 50, isNumeric } = config;

  const { t } = useTranslation();

  // Local state prevents MMKV v4 sync re-renders from breaking Android IME composition.
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const onChangeText = (text: string) => {
    setLocalValue(text);
    onChange(text);
  };

  return (
    <Input
      aria-label="text-item"
      placeholder={t('text_entry:type_placeholder')}
      onChangeText={onChangeText}
      maxLength={Number(maxLength)}
      value={localValue}
      autoCorrect={false}
      multiline={false}
      mode="survey"
      keyboardType={isNumeric ? 'numeric' : 'default'}
      {...props}
    />
  );
};
