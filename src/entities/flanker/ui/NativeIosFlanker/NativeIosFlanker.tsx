import { FC, useEffect, useMemo, useRef } from 'react';
import { NativeModules, StyleSheet } from 'react-native';

import { FlankerItemSettings } from '@app/abstract/lib';
import { Box } from '@app/shared/ui';

import SwiftFlankerWrapper from './SwiftFlankerWrapper';
import {
  FlankerGameResponse,
  FlankerNativeIosLogRecord,
} from '../../lib/types';
import { ConfigurationBuilder, parseResponse } from '../../lib/utils';

type Props = {
  configuration: FlankerItemSettings;
  onResult: (data: FlankerGameResponse) => void;
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
