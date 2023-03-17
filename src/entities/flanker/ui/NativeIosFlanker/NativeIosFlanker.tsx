import { FC, useEffect, useMemo, useRef } from 'react';
import { NativeModules, StyleSheet } from 'react-native';

import { Box } from '@app/shared/ui';

import SwiftFlankerWrapper from './SwiftFlankerWrapper';
import {
  FlankerConfiguration,
  FlankerLogRecord,
  FlankerNativeIosLogRecord,
} from '../../lib/types';
import { ConfigurationBuilder, parseResponse } from '../../lib/utils';

type Props = {
  configuration: FlankerConfiguration;
  isFirstGame: boolean;
  isLastGame: boolean;
  onResult: (data: Array<FlankerLogRecord>) => void;
  onComplete: () => void;
};

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
        props.isFirstGame,
        props.isLastGame,
      );
    }, 600);
  }, [configuration, props.isFirstGame, props.isLastGame]);

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

          if (type === 'response') {
            responses.push(parsed);
            return; // todo - life stream
          }

          const result = responses.map(x =>
            parseResponse({
              isWebView: false,
              record: x,
            }),
          );

          props.onResult(result);
          props.onComplete();
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
