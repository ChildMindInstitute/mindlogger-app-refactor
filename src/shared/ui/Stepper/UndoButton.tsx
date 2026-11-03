import { PropsWithChildren, useContext } from 'react';

import { palette } from '@app/shared/lib/constants/palette';
import { TouchableOpacity } from '@shared/ui/TouchableOpacity';

import { HandlersContext } from './contexts';
import { RestartIcon } from '../icons';
import { SubmitButton } from '../SubmitButton';

type Props = PropsWithChildren<{
  isIcon?: boolean;
}>;

export function UndoButton({ children, isIcon }: Props) {
  const { undo } = useContext(HandlersContext);

  if (isIcon) {
    return (
      <TouchableOpacity aria-label="undo-button" onPress={undo}>
        <RestartIcon color={palette.on_surface} size={30} />
      </TouchableOpacity>
    );
  }

  return (
    <SubmitButton
      mode="secondary"
      aria-label="undo-button"
      onPress={undo}
      maxWidth="100%"
      width={120}
      px={10}
      textProps={{ numberOfLines: 1, adjustsFontSizeToFit: true }}
    >
      {children}
    </SubmitButton>
  );
}
