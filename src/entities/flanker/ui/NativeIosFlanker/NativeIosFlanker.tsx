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
  const configuration = useMemo(() => {
    return ConfigurationBuilder.buildForNativeIOS(props.configuration);
  }, [props.configuration]);

  const responses = useRef<FlankerNativeIosLogRecord[]>([]).current;

  useEffect(() => {
    if (!configuration) {
      return;
    }

    const configString = JSON.stringify(configuration);

    NativeModules.FlankerViewManager.preloadGameImages(configString);

    // Race condition issue:
    // FlankerView.swift may be created after startGame call

    setTimeout(() => {
      NativeModules.FlankerViewManager.setGameParameters(configString);
      NativeModules.FlankerViewManager.startGame(
        props.configuration.isFirstPractice,
        props.configuration.isLastTest,
      );
    }, 600);
  }, [configuration, props.configuration]);

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
            trial_index: parsed.trial_index,
            duration: parsed.rt,
            question: parsed.stimulus,
            correct: parsed.correct,
            response_touch_timestamp: parsed.response_touch_timestamp,
            tag: parsed.tag,
            start_time: parsed.start_time,
            start_timestamp: parsed.image_time,
            offset: 0,
            button_pressed: parsed.button_pressed,
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
