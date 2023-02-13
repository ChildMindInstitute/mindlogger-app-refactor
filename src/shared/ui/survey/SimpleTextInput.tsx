import { FC, useState } from 'react';
import { TextInputProps } from 'react-native';

import { useTranslation } from 'react-i18next';

import { colors } from '@shared/lib';
import { Input } from '@shared/ui';

type ValueType = '' | 'http://www.w3.org/2001/XMLSchema#integer';

type Config = {
  isOptionalText: boolean;
  maxLength: number;
  removeBackOption: boolean;
  valueType: ValueType;
};

type Props = {
  valueType?: ValueType;
  config: Config;
  onChange: (text: string) => void;
} & TextInputProps;

const SimpleTextInput: FC<Props> = ({
  value = '',
  onChange,
  valueType = '',
  config,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value);

  const onChangeText = (text: string) => {
    setInputValue(text);
    onChange(text);
  };

  const keyboardType = valueType?.includes('integer') ? 'numeric' : 'default';

  return (
    <Input
      placeholder={t('text_entry:type_placeholder')}
      placeholderTextColor={colors.mediumGrey}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={Number(config?.maxLength || 50)}
      value={inputValue}
      autoCorrect={false}
      multiline={false}
      mode="survey"
    />
  );
};

export default SimpleTextInput;
