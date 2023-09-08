import { useState } from 'react';
import { Modal } from 'react-native';

import { Box } from '@app/shared/ui';

import { ConnectionForm } from './ConnectionForm';

const useConnectionMock = () => ({
  connect: () => {},
  disconnect: () => {},
  connected: false,
  port: 1230,
  ipAddress: '123.123.123.123',
});

export const ConnectionModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  const [shouldRememberConnection, setRememberConnection] = useState(false);
  const { connect, connected, disconnect, port, ipAddress } =
    useConnectionMock();

  const onConnect = () => {
    connect();
    closeModal();
  };

  const onDisconnect = () => {
    disconnect();
    closeModal();
  };

  return (
    <Modal transparent onRequestClose={closeModal} visible={isModalVisible}>
      <Box
        flex={1}
        backgroundColor="$darkerGreyBackground"
        ai="center"
        jc="center"
        px="$2"
        py="$20"
      >
        <ConnectionForm
          backgroundColor="$white"
          width="80%"
          px={30}
          py={22}
          borderRadius={12}
          onDisconnect={onDisconnect}
          onConnect={onConnect}
          onRememberConnection={() =>
            setRememberConnection(!shouldRememberConnection)
          }
          shouldRememberConnection={shouldRememberConnection}
          connected={connected}
          port={port}
          ipAddress={ipAddress}
        />
      </Box>
    </Modal>
  );
};
