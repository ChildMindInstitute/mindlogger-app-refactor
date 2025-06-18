import { FC } from 'react';
import { Image, StyleSheet } from 'react-native';

import { Paragraph } from '@tamagui/text';

import { OneUpHealthSystemItem } from '@app/shared/api/services/IOneUpHealthService';
import { palette } from '@app/shared/lib/constants/palette';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { Center } from '@app/shared/ui/Center';
import { ChevronRightIcon } from '@app/shared/ui/icons';
import { Spinner } from '@app/shared/ui/Spinner';
import { Text } from '@app/shared/ui/Text';

import { AnimatedTouchable } from '../../AnimatedTouchable';

type HealthSystemItemProps = OneUpHealthSystemItem & {
  onPress: () => void;
  isDisabled: boolean;
  isLoading: boolean;
};

export const HealthSystemItem: FC<HealthSystemItemProps> = ({
  name,
  address,
  logo,
  onPress,
  isDisabled,
  isLoading,
}) => {
  return (
    <AnimatedTouchable
      aria-label={`health-system-item-${name}`}
      onPress={onPress}
      disabled={isDisabled}
      style={{
        borderRadius: 16,
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      <XStack
        alignItems="flex-start"
        justifyContent="space-between"
        p="$4"
        gap="$4"
      >
        <Box
          style={logo ? styles.imageContainer : undefined}
          width={60}
          height={60}
        >
          {!!logo && (
            <Image
              source={{
                uri: logo,
              }}
              width={60}
              height={60}
              style={styles.image}
            />
          )}
        </Box>
        <YStack flex={1} gap="$2">
          <Text fontWeight="700">{name}</Text>
          {!!address && <Paragraph>{address}</Paragraph>}
        </YStack>
        <Center alignSelf="center" width="$2">
          {isLoading ? (
            <Spinner size={24} />
          ) : (
            <ChevronRightIcon color={palette.grey2} size={16} />
          )}
        </Center>
      </XStack>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: palette.white,
  },
  image: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
});
