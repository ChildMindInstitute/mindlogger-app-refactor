import crypto from 'react-native-quick-crypto';
import cryptoIos from 'react-native-quick-crypto-ios';

import { IS_IOS } from '../constants';

export default IS_IOS ? cryptoIos : crypto;
