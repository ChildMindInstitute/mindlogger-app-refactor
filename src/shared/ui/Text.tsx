import { Text as TGUIText, TextProps } from '@tamagui/core';

type Props = Omit<TextProps, 'fos' | 'fow' | 'lh'>;

export const Text = ({
  fontSize = 16,
  lineHeight: lineHeightProp,
  ...props
}: Props) => {
  const lineHeight =
    lineHeightProp ??
    (typeof fontSize === 'number' ? fontSize * 1.5 : undefined);

  return (
    <TGUIText
      color="$on_surface"
      fontFamily="$body"
      fontWeight="400"
      fontSize={fontSize}
      lineHeight={lineHeight}
      {...props}
    />
  );
};
