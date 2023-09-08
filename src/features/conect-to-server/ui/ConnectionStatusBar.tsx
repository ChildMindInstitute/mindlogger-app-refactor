import { FC, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { useTranslation } from 'react-i18next';

import { colors } from '@shared/lib';
import { XStack, Text, EditIcon } from '@shared/ui';

const ConnectionStatusBar: FC = () => {
  const { t } = useTranslation();
  const [liveConnectionStatus, setLiveConnectionStatus] = useState(false);

  const { ip, port, shouldShowStatusBar } = {
    ip: '127.0.0.1',
    port: '8881',
    shouldShowStatusBar: true,
  };

  const onEdit = () => {
    setLiveConnectionStatus(!liveConnectionStatus);
  };

  if (!shouldShowStatusBar) {
    return null;
  }

  return (
    <XStack px={14} mt={8}>
      <Text color="$black" fontWeight="bold" fontSize={17}>
        {t('liveStreaming:live_connection')}:
      </Text>

      <Text
        color={!liveConnectionStatus ? '$tertiary' : '$green'}
        ml={10}
        mr={20}
        fontSize={17}
      >
        {liveConnectionStatus
          ? `${ip} (${port})`
          : t('liveStreaming:not_available')}
      </Text>

      <TouchableOpacity onPress={onEdit}>
        <EditIcon color={colors.black} size={22} />
      </TouchableOpacity>
    </XStack>
  );
};

export default ConnectionStatusBar;
