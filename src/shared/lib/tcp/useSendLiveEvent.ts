import { useCallback } from 'react';

import { DrawPoint } from '@entities/drawer';
import { StabilityTrackerAnswerValue } from '@shared/api';

import { FlankerLiveEvent } from './types';
import { useTCPSocket } from './useTCPSocket';

type LiveEvent = DrawPoint | StabilityTrackerAnswerValue | FlankerLiveEvent;

export function useSendEvent(streamEnabled: boolean) {
  const { sendMessage, connected } = useTCPSocket({
    onClosed: () => {},
  });

  const sendLiveEvent = useCallback(
    (data: LiveEvent) => {
      if (!connected || !streamEnabled) {
        return;
      }

      const liveEvent = {
        type: 'live_event',
        data,
      };

      sendMessage(JSON.stringify(liveEvent));
    },
    [sendMessage, connected, streamEnabled],
  );

  return {
    sendLiveEvent,
  };
}
