import { FC } from 'react';
import { Modal, StyleSheet } from 'react-native';

import {
  GestureHandlerRootView,
  Pressable,
} from 'react-native-gesture-handler';

import { palette } from '@app/shared/lib/constants/palette';
import { Box } from '@app/shared/ui/base';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

// react-native-gesture-handler-based touchables inside a native Modal only
// receive touches when the modal content has its own GestureHandlerRootView.
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: palette.on_surface_alpha30,
  },
});

type Props = {
  visible: boolean;
  title: string;
  body: string;
  primaryLabel: string;
  primaryMode?: 'primary' | 'destructive';
  onPrimary: () => void;
  secondaryLabel: string;
  onSecondary: () => void;
  onDismiss: () => void;
  testID?: string;
};

export const ActionModal: FC<Props> = ({
  visible,
  title,
  body,
  primaryLabel,
  primaryMode = 'primary',
  onPrimary,
  secondaryLabel,
  onSecondary,
  onDismiss,
  testID = 'action-modal',
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onDismiss}
    >
      <GestureHandlerRootView style={styles.root}>
        <Box flex={1} ai="center" jc="center">
          {/* Sibling of the card, so taps on the card never reach it */}
          <Pressable
            style={styles.scrim}
            onPress={onDismiss}
            testID={`${testID}-scrim`}
          />

          <Box
            bg="$surface"
            borderRadius={28}
            mx={16}
            maxWidth={361}
            w="100%"
            overflow="hidden"
            testID={testID}
          >
            <Box pt={20} pl={32} pr={20} pb={16}>
              <Text fontSize={24} lineHeight={32} color="$on_surface">
                {title}
              </Text>
            </Box>

            <Box px={32} py={12}>
              <Text
                fontSize={16}
                lineHeight={24}
                letterSpacing={0.5}
                color="$on_surface"
              >
                {body}
              </Text>
            </Box>

            <Box pt={24} pb={32} px={32} gap={16}>
              <SubmitButton
                mode={primaryMode}
                onPress={onPrimary}
                testID={`${testID}-primary`}
              >
                {primaryLabel}
              </SubmitButton>

              <SubmitButton
                mode="text"
                onPress={onSecondary}
                testID={`${testID}-secondary`}
              >
                {secondaryLabel}
              </SubmitButton>
            </Box>
          </Box>
        </Box>
      </GestureHandlerRootView>
    </Modal>
  );
};
