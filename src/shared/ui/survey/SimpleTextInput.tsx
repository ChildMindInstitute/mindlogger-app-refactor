import { FC, useState } from 'react';
import { TextInputProps } from 'react-native';

import { useTranslation } from 'react-i18next';

import { colors } from '@shared/lib';
import { Input } from '@shared/ui';

type Props = {
  config: {
    maxLength: number;
    valueType: '' | 'http://www.w3.org/2001/XMLSchema#integer';
  };
  onChange: (text: string) => void;
} & TextInputProps;

const SimpleTextInput: FC<Props> = ({
  value: initialValue = '',
  onChange,
  config,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue);

  const onChangeText = (text: string) => {
    setValue(text);
    onChange(text);
  };

  const { maxLength = 50, valueType = '' } = config;

  const keyboardType = valueType?.includes('integer') ? 'numeric' : 'default';

  return (
    <Input
      placeholder={t('text_entry:type_placeholder')}
      placeholderTextColor={colors.mediumGrey}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={Number(maxLength)}
      value={value}
      autoCorrect={false}
      multiline={false}
      mode="survey"
    />
  );
};

export default SimpleTextInput;
