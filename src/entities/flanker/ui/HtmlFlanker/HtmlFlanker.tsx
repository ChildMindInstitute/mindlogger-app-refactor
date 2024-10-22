import { FC, useMemo, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';

import WebView from 'react-native-webview';

import { FlankerItemSettings } from '@app/abstract/lib/types/flanker';
import {
  FlankerLiveEvent,
  StreamEventLoggable,
} from '@app/shared/lib/tcp/types';
import { Box } from '@app/shared/ui/base';

import {
  FlankerGameResponse,
  FlankerWebViewLogRecord,
} from '../../lib/types/response';
import { getDefaultConfigurationBuilder } from '../../lib/utils/configurationBuilderInstance';
import {
  getScreensNumberPerTrial,
  parseResponse,
} from '../../lib/utils/helpers';

const htmlAsset = require('./visual-stimulus-response.html');

type Props = {
  configuration: FlankerItemSettings;
  onResult: (data: FlankerGameResponse) => void;
} & StreamEventLoggable<FlankerLiveEvent>;

export const HtmlFlanker: FC<Props> = props => {
  const webView = useRef<unknown>();

  const configuration = useMemo(() => {
    return getDefaultConfigurationBuilder().buildForWebView(
      props.configuration,
    );
  }, [props.configuration]);

  const parsedConfiguration = useMemo(() => {
    if (!configuration) {
      return null;
    }
    return getDefaultConfigurationBuilder().parseToWebViewConfigString(
      configuration,
    );
  }, [configuration]);

  const source = Platform.select({
    ios: htmlAsset,
    android: {
      uri: 'file:///android_asset/html/visual-stimulus-response.html',
    },
  });

  const scriptToInject = `preloadButtonImages(${JSON.stringify(
    configuration.buttons,
  )}); \n ${parsedConfiguration}`;

  return (
    <Box flex={1}>
      <WebView
        ref={(ref: unknown) => (webView.current = ref)}
        style={styles.webView}
        source={source}
        originWhitelist={['*']}
        injectedJavaScript={scriptToInject}
        onMessage={(e: any) => {
          const dataString = e.nativeEvent.data;
          const parsed = JSON.parse(dataString);
          const data: FlankerWebViewLogRecord[] | FlankerWebViewLogRecord =
            parsed.data;
          const type = parsed.type;

          if (type === 'console') {
            return;
          }

          if (type === 'response') {
            const responseData = parsed.data as FlankerWebViewLogRecord;

            const liveEvent: FlankerLiveEvent = {
              trialIndex: responseData.trial_index,
              duration: responseData.rt,
              question: responseData.stimulus,
              buttonPressed: responseData.button_pressed,
              imageTime: responseData.image_time,
              startTime: responseData.start_time,
              correct: responseData.correct,
              startTimestamp: responseData.start_timestamp,
              tag: responseData.tag,
              showFeedback: configuration.showFeedback,
              showFixation: configuration.showFixation,
              type: 'Flanker',
            };

            props.onLog(liveEvent);

            return;
          }

          const result = (data as FlankerWebViewLogRecord[])
            .filter(x => x.tag !== 'result' && x.tag !== 'prepare')
            .map(x =>
              parseResponse({
                isWebView: true,
                numberOfScreensPerTrial: getScreensNumberPerTrial(
                  props.configuration,
                ),
                record: x,
              }),
            );
          props.onResult({
            records: result,
            gameType: props.configuration.blockType,
          });
        }}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    height: '100%',
  },
});
