import { FC, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useAppletStreamingStatus } from '@entities/applet/lib/hooks';
import { colors, useTCPSocket } from '@shared/lib';
import { XStack, Text, EditIcon } from '@shared/ui';

import { ConnectionModal } from './ConnectionModal';

type Props = {
  appletId: string;
};

const ConnectionStatusBar: FC<Props> = ({ appletId }) => {
  const { t } = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  const streamEnabled = useAppletStreamingStatus(appletId);

  const { connected, getSocketInfo } = useTCPSocket();

  const { host, port } = getSocketInfo() ?? {};

  const onEdit = () => {
    setModalVisible(true);
  };

  if (!streamEnabled) {
    return null;
  }

  return (
    <>
      <XStack px={14} mt={8}>
        <Text color="$black" fontWeight="bold" fontSize={17}>
          {t('live_connection:live_connection')}:
        </Text>

        <Text
          color={!connected ? '$tertiary' : '$green'}
          ml={10}
          mr={20}
          fontSize={17}
        >
          {connected ? `${host} (${port})` : t('live_connection:not_available')}
        </Text>

        <TouchableOpacity onPress={onEdit}>
          <EditIcon color={colors.black} size={22} />
        </TouchableOpacity>
      </XStack>

      <ConnectionModal visible={isModalVisible} onClose={closeModal} />
    </>
  );
};

export default ConnectionStatusBar;
