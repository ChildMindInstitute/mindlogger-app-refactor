import { FC, useState } from 'react';
import { TextInputProps } from 'react-native';

import { useTranslation } from 'react-i18next';

import { colors } from '@shared/lib';
import { Input } from '@shared/ui';

type Props = {
  onChange: (text: string) => void;
  initialValue?: string;
  config: {
    // @todo make sure backend will return this type after refactoring
    maxLength?: string;
    isNumeric: boolean;
  };
} & TextInputProps;

const SimpleTextInput: FC<Props> = ({
  initialValue = '',
  onChange,
  config,
  ...props
}) => {
  const { maxLength = 50, isNumeric } = config;

  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue);

  const onChangeText = (text: string) => {
    setValue(text);
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
