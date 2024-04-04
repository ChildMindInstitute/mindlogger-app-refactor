import { PropsWithChildren, useCallback, useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { useDebouncedCallback } from 'use-debounce';

import { colors } from '@shared/lib';
import { RightArrowIcon } from '@shared/ui';

import ActionButton from './ActionButton';
import { HandlersContext } from './contexts';

type Props = PropsWithChildren<{
  isIcon?: boolean;
  accessibilityLabel: string | null;
}>;

const DEBOUNCE_DELAY = 300;

function NextButton({ children, isIcon, accessibilityLabel }: Props) {
  const { next } = useContext(HandlersContext);

  const onPressNext = useCallback(() => {
    next({ isForced: false, shouldAutoSubmit: true });
  }, [next]);

  const onPressNextDebounced = useDebouncedCallback(
    onPressNext,
    DEBOUNCE_DELAY,
  );

  if (isIcon) {
    return (
      <TouchableOpacity
        accessibilityLabel={`${accessibilityLabel}-top` ?? ''}
        onPress={onPressNextDebounced}
      >
        <RightArrowIcon color={colors.tertiary} size={30} />
      </TouchableOpacity>
    );
  }

  return (
    <ActionButton
      accessibilityLabel={`${accessibilityLabel}-bottom` ?? ''}
      onPress={onPressNextDebounced}
    >
      {children}
    </ActionButton>
  );
}

export default NextButton;
