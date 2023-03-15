/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import WebView from 'react-native-webview';

import { Box } from '@app/shared/ui';

import {
  FlankerConfiguration,
  FlankerLogRecord,
  FlankerWebViewLogRecord,
} from '../lib/types';
import {
  ConfigurationBuilder,
  getScreensNumberPerTrial,
  parseResponse,
} from '../lib/utils';

const htmlAsset = require('./visual-stimulus-response.html');

type Props = {
  configuration: FlankerConfiguration;
  onResult: (data: Array<FlankerLogRecord>) => void;
  onComplete: () => void;
};

const HtmlFlanker: FC<Props> = props => {
  const [isLoaded, setIsLoaded] = useState(false);

  const webView = useRef<any>();

  const { configuration, parsedConfiguration } = useMemo(() => {
    const builtConfig = ConfigurationBuilder.buildForWebView(
      props.configuration,
    );
    const parsedConfig =
      ConfigurationBuilder.parseToWebViewConfigString(builtConfig);
    return { configuration: builtConfig, parsedConfiguration: parsedConfig };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    webView.current.injectJavaScript(parsedConfiguration);
  }, [isLoaded]);

  const source = Platform.select({
    ios: htmlAsset,
    android: {
      uri: 'file:///android_asset/html/visual-stimulus-response.html',
    },
  });

  return (
    <Box flex={1}>
      <WebView
        ref={ref => (webView.current = ref)}
        style={{ flex: 1, height: '100%' }}
        onLoad={() => setIsLoaded(true)}
        source={source}
        originWhitelist={['*']}
        injectedJavaScript={`preloadButtonImages(${JSON.stringify(
          configuration.buttons,
        )})`}
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
          props.onResult(result);
          props.onComplete();
        }}
      />
    </Box>
  );
};

export default HtmlFlanker;
