import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { IS_IOS } from '@app/shared/lib/constants';
import { Input } from '@app/shared/ui/Input';

type Props = {
  value?: string;
  onChange: (value: string) => void;
  required: boolean;
};

const MIN_FIELD_HEIGHT = 48;
const MAX_FIELD_HEIGHT = 100;
const GROW_THRESHOLD = IS_IOS ? 15 : 0;

export function AdditionalText({ value, onChange, required }: Props) {
  const { t } = useTranslation();
  const [height, setHeight] = useState(MIN_FIELD_HEIGHT);

  // Local state prevents MMKV v4 sync re-renders from breaking Android IME composition.
  const [localValue, setLocalValue] = useState(value ?? '');
  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);

  const onChangeText = (text: string) => {
    setLocalValue(text);
    onChange(text);
  };

  const placeholder = t(
    required ? 'optional_text:required' : 'optional_text:enter_text',
  );

  return (
    <Input
      placeholder={placeholder}
      aria-label="additional_text-input"
      value={localValue}
      onChangeText={onChangeText}
      onContentSizeChange={e => {
        const contentHeight = e.nativeEvent.contentSize.height;

        if (contentHeight < MAX_FIELD_HEIGHT) {
          setHeight(e.nativeEvent.contentSize.height + GROW_THRESHOLD);
        }
      }}
      autoCorrect={false}
      multiline
      mode="survey"
      textAlignVertical="top"
      height={height}
      minHeight={MIN_FIELD_HEIGHT}
      maxHeight={MAX_FIELD_HEIGHT}
    />
  );
}
