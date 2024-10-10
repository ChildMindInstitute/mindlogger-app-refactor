import { PropsWithChildren, useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { colors } from '@app/shared/lib/constants/colors';

import { ActionButton } from './ActionButton';
import { HandlersContext } from './contexts';
import { RestartIcon } from '../icons';

type Props = PropsWithChildren<{
  isIcon?: boolean;
}>;

export function UndoButton({ children, isIcon }: Props) {
  const { undo } = useContext(HandlersContext);

  if (isIcon) {
    return (
      <TouchableOpacity accessibilityLabel="undo-button" onPress={undo}>
        <RestartIcon color={colors.tertiary} size={30} />
      </TouchableOpacity>
    );
  }

  return (
    <ActionButton
      type="flat"
      alignSelf="center"
      accessibilityLabel="undo-button"
      onPress={undo}
    >
      {children}
    </ActionButton>
  );
}
