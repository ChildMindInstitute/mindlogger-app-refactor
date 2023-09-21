import { Modal } from 'react-native';

import { Box } from '@app/shared/ui';

import { ConnectionForm } from './ConnectionForm';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const ConnectionModal = ({ visible, onClose }: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent
      onRequestClose={onClose}
      visible={visible}
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
        />
      </Box>
    </Modal>
  );
};
