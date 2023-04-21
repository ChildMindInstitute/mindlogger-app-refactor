import { PropsWithChildren, useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { colors } from '@shared/lib';
import { RightArrowIcon } from '@shared/ui';

import ActionButton from './ActionButton';
import { HandlersContext } from './contexts';

type Props = PropsWithChildren<{
  isIcon?: boolean;
}>;

function NextButton({ children, isIcon }: Props) {
  const { next } = useContext(HandlersContext);

  if (isIcon) {
    return (
      <TouchableOpacity onPress={next}>
        <RightArrowIcon color={colors.tertiary} size={30} />
      </TouchableOpacity>
    );
  }

  return <ActionButton onPress={next}>{children}</ActionButton>;
}

export default NextButton;
