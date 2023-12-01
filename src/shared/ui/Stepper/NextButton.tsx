import { PropsWithChildren, useCallback, useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { StepperNextButtonType } from '@app/features/pass-survey';
import { colors } from '@shared/lib';
import { RightArrowIcon } from '@shared/ui';

import ActionButton from './ActionButton';
import { HandlersContext } from './contexts';

type Props = PropsWithChildren<{
  isIcon?: boolean;
  type: StepperNextButtonType | null;
}>;

function NextButton({ children, isIcon, type }: Props) {
  const { next } = useContext(HandlersContext);

  const onPressNext = useCallback(() => {
    next(false);
  }, [next]);

  if (isIcon) {
    return (
      <TouchableOpacity
        accessibilityLabel={`${type}-button`}
        onPress={onPressNext}
      >
        <RightArrowIcon color={colors.tertiary} size={30} />
      </TouchableOpacity>
    );
  }

  return (
    <ActionButton accessibilityLabel={`${type}-button`} onPress={onPressNext}>
      {children}
    </ActionButton>
  );
}

export default NextButton;
