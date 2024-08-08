import { FC, useEffect, useMemo, useRef } from 'react';
import { NativeModules, StyleSheet } from 'react-native';

import { FlankerItemSettings } from '@app/abstract/lib';
import { FlankerLiveEvent, StreamEventLoggable } from '@shared/lib';
import { Box } from '@shared/ui';

import SwiftFlankerWrapper from './SwiftFlankerWrapper';
import {
  FlankerGameResponse,
  FlankerNativeIosLogRecord,
} from '../../lib/types';
import { ConfigurationBuilder, parseResponse } from '../../lib/utils';

type Props = {
  configuration: FlankerItemSettings;
  onResult: (data: FlankerGameResponse) => void;
} & StreamEventLoggable<FlankerLiveEvent>;

const NativeIosFlanker: FC<Props> = props => {
  const initializedRef = useRef(false);

  const configuration = useMemo(() => {
    return ConfigurationBuilder.buildForNativeIOS(props.configuration);
  }, [props.configuration]);

  const responses = useRef<FlankerNativeIosLogRecord[]>([]).current;

  const { isFirstPractice, isLastTest } = props.configuration;

  useEffect(() => {
    if (!configuration || initializedRef.current) {
      return;
    }

    const configString = JSON.stringify(configuration);

    NativeModules.FlankerViewManager.setGameParameters(configString);
    NativeModules.FlankerViewManager.startGame(isFirstPractice, isLastTest);

    initializedRef.current = true;
  }, [configuration, isFirstPractice, isLastTest, props.configuration]);

  return (
    <Box flex={1}>
      <SwiftFlankerWrapper
        style={styles.wrapper}
        onLogResult={e => {
          const dataString = e.data;
          const type = e.type;
          const parsed: FlankerNativeIosLogRecord = JSON.parse(dataString);

          if (parsed.trial_index > configuration.trials.length) {
            return;
          }

          const liveEvent: FlankerLiveEvent = {
            trialIndex: parsed.trial_index,
            duration: parsed.rt,
            question: parsed.stimulus,
            correct: parsed.correct,
            responseTouchTimeStamp: parsed.response_touch_timestamp,
            tag: parsed.tag,
            startTime: parsed.start_time,
            startTimestamp: parsed.image_time,
            offset: 0,
            buttonPressed: parsed.button_pressed,
            type: 'Flanker',
          };

          if (type === 'response') {
            responses.push(parsed);
            props.onLog(liveEvent);

            return;
          }

          const result = responses.map(x =>
            parseResponse({
              isWebView: false,
              record: x,
            }),
          );

          props.onResult({
            gameType: props.configuration.blockType,
            records: result,
          });
        }}
      />
    </Box>
  );
};

export default NativeIosFlanker;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
