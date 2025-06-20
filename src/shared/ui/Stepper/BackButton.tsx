import { PropsWithChildren, useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { palette } from '@app/shared/lib/constants/palette';

import { HandlersContext } from './contexts';
import { LeftArrowIcon } from '../icons';
import { SubmitButton } from '../SubmitButton';

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
    <SubmitButton
      mode="secondary"
      aria-label="back-button"
      onPress={back}
      minWidth={120}
    >
      {children}
    </SubmitButton>
  );
}
