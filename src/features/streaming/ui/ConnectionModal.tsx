import { Modal } from 'react-native';

import { IS_IOS } from '@app/shared/lib/constants';
import { Box } from '@app/shared/ui/base';
import { KeyboardAvoidingView } from '@app/shared/ui/KeyboardAvoidingView';

import { ConnectionForm } from './ConnectionForm';

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
    </Modal>
  );
};
