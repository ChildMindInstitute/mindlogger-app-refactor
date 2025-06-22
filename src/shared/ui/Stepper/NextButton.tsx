import { PropsWithChildren, useCallback, useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { useThrottledCallback } from 'use-debounce';

import { palette } from '@app/shared/lib/constants/palette';

import { HandlersContext } from './contexts';
import { RightArrowIcon } from '../icons';
import { SubmitButton } from '../SubmitButton';

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
        aria-label={`${accessibilityLabel}-top` ?? ''}
        onPress={onPressNextDebounced}
      >
        <RightArrowIcon color={palette.on_surface} size={30} />
      </TouchableOpacity>
    );
  }

  return (
    <SubmitButton
      aria-label={`${accessibilityLabel}-bottom` ?? ''}
      onPress={onPressNextDebounced}
      width="100%"
    >
      {children}
    </SubmitButton>
  );
}
