import { PropsWithChildren, useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { colors } from '@shared/lib';
import { RestartIcon } from '@shared/ui';

import ActionButton from './ActionButton';
import { HandlersContext } from './contexts';

type Props = PropsWithChildren<{
  isIcon?: boolean;
}>;

function UndoButton({ children, isIcon }: Props) {
  const { undo } = useContext(HandlersContext);

  if (isIcon) {
    return (
      <TouchableOpacity onPress={undo}>
        <RestartIcon color={colors.tertiary} size={30} />
      </TouchableOpacity>
    );
  }

  return <ActionButton onPress={undo}>{children}</ActionButton>;
}

export default UndoButton;
