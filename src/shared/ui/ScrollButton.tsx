import { StyleSheet } from 'react-native';

import { styled } from '@tamagui/core';
import { XStackProps, XStack } from '@tamagui/stacks';

import { ChevronDownIcon } from './icons';
import { palette } from '../lib/constants/palette';

const Button = styled(XStack, {
  width: 60,
  height: 60,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$surface',
  borderWidth: 1.5,
  borderRadius: 35,
  borderColor: '$outline',
});

type Props = {
  onPress: () => void;
} & XStackProps;

export function ScrollButton({ onPress, ...styledProps }: Props) {
  return (
    <XStack flex={1} style={styles.shadow} onPress={onPress} {...styledProps}>
      <Button>
        <ChevronDownIcon color={palette.primary} size={17} />
      </Button>
    </XStack>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 7.5,
    elevation: 4,
  },
});
