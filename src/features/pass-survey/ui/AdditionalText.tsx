import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { colors } from '@app/shared/lib';
import { Input } from '@app/shared/ui';

type Props = {
  value: string | undefined;
  onChange: (value: string) => void;
  required: boolean;
};

const MIN_FIELD_HEIGHT = 40;
const MAX_FIELD_HEIGHT = 100;
const GROW_THRESHOLD = 15;

function AdditionalText({ value, onChange, required }: Props) {
  const { t } = useTranslation();
  const [height, setHeight] = useState(MIN_FIELD_HEIGHT);

  const placeholder = t(
    required ? 'optional_text:required' : 'optional_text:enter_text',
  );

  return (
    <Input
      placeholder={placeholder}
      placeholderTextColor={colors.mediumGrey}
      value={value}
      onChangeText={onChange}
      onContentSizeChange={e => {
        const contentHeight = e.nativeEvent.contentSize.height;

        if (contentHeight < MAX_FIELD_HEIGHT) {
          setHeight(e.nativeEvent.contentSize.height + GROW_THRESHOLD);
        }
      }}
      autoCorrect={false}
      multiline
      mode="survey"
      fontSize={14}
      textAlignVertical="top"
      height={height}
      minHeight={MIN_FIELD_HEIGHT}
      maxHeight={MAX_FIELD_HEIGHT}
    />
  );
}

export default AdditionalText;
