import { FlankerItemSettings } from '@app/abstract/lib/types/flanker';

import {
  FlankerNativeIOSConfiguration,
  FlankerWebViewConfiguration,
} from '../types/configuration';

export type IConfigurationBuilder = {
  buildForWebView: (
    configuration: FlankerItemSettings,
  ) => FlankerWebViewConfiguration;

  buildForNativeIOS: (
    configuration: FlankerItemSettings,
  ) => FlankerNativeIOSConfiguration;

  parseToWebViewConfigString: (
    testConfiguration: FlankerWebViewConfiguration,
  ) => string;
};
