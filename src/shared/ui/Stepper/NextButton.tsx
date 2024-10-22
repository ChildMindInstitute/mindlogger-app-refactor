import { PropsWithChildren, useCallback, useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { useThrottledCallback } from 'use-debounce';

import { colors } from '@app/shared/lib/constants/colors';

import { ActionButton } from './ActionButton';
import { HandlersContext } from './contexts';
import { RightArrowIcon } from '../icons';

type Props = PropsWithChildren<{
  isIcon?: boolean;
  accessibilityLabel: string | null;
}>;

const THROTTLE_DELAY = 300;

export function NextButton({ children, isIcon, accessibilityLabel }: Props) {
  const { next } = useContext(HandlersContext);

  const onPressNext = useCallback(() => {
    next({ isForced: false, shouldAutoSubmit: true });
  }, [next]);

  const onPressNextDebounced = useThrottledCallback(
    onPressNext,
    THROTTLE_DELAY,
    {
      leading: true,
      trailing: false,
    },
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
      alignSelf="flex-end"
    >
      {children}
    </ActionButton>
  );
}
