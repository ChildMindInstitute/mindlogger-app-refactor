import { useCallback } from 'react';

import { LiveEventDto } from './types';
import { useTCPSocket } from './useTCPSocket';

export function useSendEvent(streamEnabled: boolean) {
  const { sendMessage, connected } = useTCPSocket({
    onClosed: () => {},
  });

  const sendLiveEvent = useCallback(
    (dataDto: LiveEventDto) => {
      if (!connected || !streamEnabled) {
        return;
      }

      const liveEvent = {
        type: 'live_event',
        data: dataDto,
      };

      sendMessage(JSON.stringify(liveEvent));
    },
    [sendMessage, connected, streamEnabled],
  );

  return {
    sendLiveEvent,
  };
}
