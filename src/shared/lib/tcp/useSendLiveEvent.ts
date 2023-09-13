import { useCallback, useContext } from 'react';

import { useAppletStreamingStatus } from '@entities/applet/lib/hooks';
import { DrawPoint } from '@entities/drawer';
import { FlankerWebViewLogRecord } from '@entities/flanker';
import { ActivityIdentityContext } from '@features/pass-survey';
import { StabilityTrackerAnswerValue } from '@shared/api';

import { useTCPSocket } from './useTCPSocket';

type LiveEvent =
  | DrawPoint
  | StabilityTrackerAnswerValue
  | FlankerWebViewLogRecord
  | FlankerWebViewLogRecord[];

export function useSendEvent() {
  const { appletId } = useContext(ActivityIdentityContext);
  const { sendMessage, connected } = useTCPSocket({
    onClosed: () => {},
  });

  const streamEnabled = useAppletStreamingStatus(appletId);
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
