import { PropsWithChildren, useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { colors } from '@app/shared/lib/constants/colors';

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
        <LeftArrowIcon color={colors.tertiary} size={30} />
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
