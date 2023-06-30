import { FC, useMemo, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';

import WebView from 'react-native-webview';

import { FlankerItemSettings } from '@app/abstract/lib';
import { Box } from '@app/shared/ui';

import { FlankerGameResponse, FlankerWebViewLogRecord } from '../../lib/types';
import {
  ConfigurationBuilder,
  getScreensNumberPerTrial,
  parseResponse,
} from '../../lib/utils';

const htmlAsset = require('./visual-stimulus-response.html');

type Props = {
  configuration: FlankerItemSettings;
  onResult: (data: FlankerGameResponse) => void;
};

const HtmlFlanker: FC<Props> = props => {
  const webView = useRef<any>();

  const configuration = useMemo(() => {
    return ConfigurationBuilder.buildForWebView(props.configuration);
  }, [props.configuration]);

  const parsedConfiguration = useMemo(() => {
    if (!configuration) {
      return null;
    }
    return ConfigurationBuilder.parseToWebViewConfigString(configuration);
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
        ref={ref => (webView.current = ref)}
        style={styles.webView}
        source={source}
        originWhitelist={['*']}
        injectedJavaScript={scriptToInject}
        onMessage={(e: any) => {
          const dataString = e.nativeEvent.data;
          const parsed = JSON.parse(dataString);
          const data: FlankerWebViewLogRecord[] = parsed.data;
          const type = parsed.type;

          if (type === 'console') {
            return;
          }
          if (type === 'response') {
            return; // todo - life stream
          }

          const result = data
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

export default HtmlFlanker;

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    height: '100%',
  },
});
