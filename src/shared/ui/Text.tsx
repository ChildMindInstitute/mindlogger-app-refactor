import { Text as TGUIText, TextProps } from '@tamagui/core';

type Props = TextProps;

export const Text = ({
  fontSize = 16,
  lineHeight: lineHeightProp,
  ...props
}: Props) => {
  const lineHeight =
    lineHeightProp ??
    (typeof fontSize === 'number' ? fontSize * 1.25 : undefined);

  return (
    <TGUIText
      color="$black"
      fontFamily="$body"
      fontWeight="400"
      fontSize={fontSize}
      lineHeight={lineHeight}
      {...props}
    />
  );
};
