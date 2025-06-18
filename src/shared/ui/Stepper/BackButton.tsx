import { PropsWithChildren, useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { palette } from '@app/shared/lib/constants/palette';

import { ActionButton } from './ActionButton';
import { HandlersContext } from './contexts';
import { LeftArrowIcon } from '../icons';

type Props = PropsWithChildren<{
  isIcon?: boolean;
}>;

export function BackButton({ children, isIcon }: Props) {
  const { back } = useContext(HandlersContext);

  if (isIcon) {
    return (
      <TouchableOpacity accessibilityLabel="back-button" onPress={back}>
        <LeftArrowIcon color={palette.tertiary} size={30} />
      </TouchableOpacity>
    );
  }

  return (
    <ActionButton
      alignSelf="flex-start"
      type="flat"
      accessibilityLabel="back-button"
      onPress={back}
    >
      {children}
    </ActionButton>
  );
}
