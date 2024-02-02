import { useCallback } from 'react';

import { mapStreamEventToDto } from './lib/streamEventMapper';
import { LiveEvent, StreamEventActivityItemType } from './types';
import { useTCPSocket } from './useTCPSocket';

export function useSendEvent(
  type: StreamEventActivityItemType,
  streamEnabled: boolean,
) {
  const { sendMessage, connected } = useTCPSocket({
    onClosed: () => {},
  });

  const sendLiveEvent = useCallback(
    (data: LiveEvent) => {
      if (!connected || !streamEnabled) {
        return;
      }
      const dataDto = mapStreamEventToDto(type, data);

      const liveEvent = {
        type: 'live_event',
        data: dataDto,
      };

      sendMessage(JSON.stringify(liveEvent));
    },
    [type, sendMessage, connected, streamEnabled],
  );

  return {
    sendLiveEvent,
  };
}
