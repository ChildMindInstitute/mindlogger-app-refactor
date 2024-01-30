import { PropsWithChildren, useCallback, useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { colors } from '@shared/lib';
import { RightArrowIcon } from '@shared/ui';

import ActionButton from './ActionButton';
import { HandlersContext } from './contexts';

type Props = PropsWithChildren<{
  isIcon?: boolean;
  accessibilityLabel: string | null;
}>;

function NextButton({ children, isIcon, accessibilityLabel }: Props) {
  const { next } = useContext(HandlersContext);

  const onPressNext = useCallback(() => {
    next({ isForced: false, shouldAutoSubmit: true });
  }, [next]);

  if (isIcon) {
    return (
      <TouchableOpacity
        accessibilityLabel={`${accessibilityLabel}-top` ?? ''}
        onPress={onPressNext}
      >
        <RightArrowIcon color={colors.tertiary} size={30} />
      </TouchableOpacity>
    );
  }

  return (
    <ActionButton
      accessibilityLabel={`${accessibilityLabel}-bottom` ?? ''}
      onPress={onPressNext}
    >
      {children}
    </ActionButton>
  );
}

export default NextButton;
