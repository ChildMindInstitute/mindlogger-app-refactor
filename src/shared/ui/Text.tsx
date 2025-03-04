import { Text as TGUIText, TextProps } from '@tamagui/core';

type Props = TextProps;

export const Text = (props: Props) => (
  <TGUIText color="$black" fontFamily="$body" fontWeight="400" {...props} />
);
