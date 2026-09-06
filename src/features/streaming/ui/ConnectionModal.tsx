import { Modal, StyleSheet } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { IS_IOS } from '@app/shared/lib/constants';
import { Box } from '@app/shared/ui/base';
import { KeyboardAvoidingView } from '@app/shared/ui/KeyboardAvoidingView';

import { ConnectionForm } from './ConnectionForm';

// react-native-gesture-handler-based touchables inside a native Modal only
// receive touches when the modal content has its own GestureHandlerRootView.
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

type Props = {
  visible: boolean;
  onClose: () => void;
  appletId: string;
};

export const ConnectionModal = ({ visible, onClose, appletId }: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent
      onRequestClose={onClose}
      visible={visible}
      accessibilityLabel="streaming-connection-modal"
    >
      <GestureHandlerRootView style={styles.root}>
        <KeyboardAvoidingView
          behavior="padding"
          enabled={IS_IOS}
          flex={1}
          contentContainerStyle={{ flex: 1 }}
          keyboardVerticalOffset={-120}
        >
          <Box
            flex={1}
            backgroundColor="$darkerGreyBackground"
            ai="center"
            jc="center"
            px="$2"
            py="$20"
            onPress={onClose}
          >
            <ConnectionForm
              backgroundColor="$white"
              width="80%"
              px={30}
              py={22}
              borderRadius={12}
              onSubmitSuccess={onClose}
              appletId={appletId}
            />
          </Box>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
};
