import { FC } from 'react';
import { AccessibilityProps, StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';

import { Box, XStack, YStack } from '@app/shared/ui/base';
import { RoundLogo } from '@app/shared/ui/RoundLogo';
import { RoundTextNotification } from '@app/shared/ui/RoundTextNotification';
import { Text } from '@app/shared/ui/Text';
import { TouchableOpacity } from '@app/shared/ui/TouchableOpacity';

import { Applet } from '../lib/types';

type Props = {
  applet: Applet;
  disabled: boolean;
  onPress?: (...args: any[]) => void;
};

export const AppletCard: FC<Props & AccessibilityProps> = ({
  applet,
  disabled,
  onPress,
  accessibilityLabel,
}) => {
  const theme = applet.theme;

  const renderThemeLogo = () => {
    if (theme?.logo) {
      return <CachedImage style={styles.smallLogo} source={theme.logo} />;
    }

    return null;
  };

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
    >
      <XStack
        position="relative"
        mx={3}
        p={12}
        borderWidth={3}
        borderColor="$lighterGrey"
        borderRadius={9}
        opacity={disabled ? 0.5 : 1}
        backgroundColor="$white"
      >
        <Box mr={14}>
          <RoundLogo
            accessibilityLabel="applet_logo-image"
            imageUri={applet.image}
            letter={applet.displayName[0].toUpperCase()}
          />
        </Box>

        <YStack flexGrow={1} flexShrink={1}>
          <XStack jc="space-between">
            <Text
              mb={8}
              flex={1}
              fontWeight="700"
              fontSize={16}
              accessibilityLabel="applet_name-text"
              lineHeight={20}
            >
              {applet.displayName}
            </Text>

            {renderThemeLogo()}
          </XStack>

          <Text
            accessibilityLabel="applet_description-text"
            fontSize={14}
            fontWeight="400"
            lineHeight={20}
          >
            {applet.description}
          </Text>
        </YStack>

        {!!applet.numberOverdue && (
          <Box position="absolute" top={-14} right={-14}>
            <RoundTextNotification
              accessibilityLabel="applet_number_overdue-text"
              text={applet.numberOverdue.toString()}
            />
          </Box>
        )}
      </XStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  smallLogo: {
    width: 60,
    height: 30,
    resizeMode: 'contain',
    marginTop: -5,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'cover',
    borderRadius: 32 / 2,
  },
});
