import { FC, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { XStackProps } from '@tamagui/stacks';
import { useTranslation } from 'react-i18next';

import { useAppletStreamingDetails } from '@app/entities/applet/lib/hooks/useAppletStreamingDetails';
import { palette } from '@app/shared/lib/constants/palette';
import { useTCPSocket } from '@app/shared/lib/tcp/useTCPSocket';
import { XStack } from '@app/shared/ui/base';
import { EditIcon } from '@app/shared/ui/icons';
import { Text } from '@app/shared/ui/Text';

import { ConnectionModal } from './ConnectionModal';

type Props = {
  appletId: string;
} & XStackProps;

export const ConnectionStatusBar: FC<Props> = ({ appletId, ...styleProps }) => {
  const { t } = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  const streamingDetails = useAppletStreamingDetails(appletId);

  const { connected, getSocketInfo } = useTCPSocket();

  const { host, port } = getSocketInfo() ?? {};

  const onEdit = () => {
    setModalVisible(true);
  };

  if (!streamingDetails?.streamEnabled) {
    return null;
  }

  return (
    <>
      <XStack px={14} mt={8} {...styleProps}>
        <Text color="$black" fontWeight="700" fontSize={17}>
          {t('live_connection:live_connection')}:
        </Text>

        <Text
          color={!connected ? '$tertiary' : '$green'}
          ml={10}
          mr={20}
          fontSize={17}
          accessibilityLabel="streaming-status-title"
        >
          {connected ? `${host} (${port})` : t('live_connection:not_available')}
        </Text>

        <TouchableOpacity
          accessibilityLabel="streaming-modal-open-btn"
          onPress={onEdit}
        >
          <EditIcon color={palette.black} size={22} />
        </TouchableOpacity>
      </XStack>

      <ConnectionModal
        visible={isModalVisible}
        onClose={closeModal}
        appletId={appletId}
      />
    </>
  );
};
