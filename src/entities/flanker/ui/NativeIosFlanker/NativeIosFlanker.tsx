import { FC, useEffect, useMemo, useRef } from 'react';
import { NativeModules, StyleSheet } from 'react-native';

import { FlankerItemSettings } from '@app/abstract/lib';
import { FlankerLiveEvent, Logger, StreamEventLoggable } from '@shared/lib';
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

    NativeModules.FlankerViewManager.preloadGameImages(configString)
      .then(() => {
        NativeModules.FlankerViewManager.setGameParameters(configString);
        NativeModules.FlankerViewManager.startGame(
          props.configuration.isFirstPractice,
          props.configuration.isLastTest,
        );
      })
      .catch((error: string) =>
        Logger.log(
          `[NativeModules.FlankerViewManager.preloadGameImages] An internal error occurred during caching images or starting the game: \n\n ${error}`,
        ),
      );
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
