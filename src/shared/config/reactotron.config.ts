import Config from 'react-native-config';
import Reactotron, {
  type ReactotronReactNative,
} from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

import { configureMMKVTracking } from '@shared/lib/storages/ReactotronMMKVTracker';

/**
 * Reactotron Configuration
 *
 * Debug tool for React Native applications providing:
 * - Redux state and action tracking
 * - MMKV storage monitoring (all instances)
 * - Network request/response logging
 * - Error/warning overlay
 *
 * Only enabled in dev environment builds.
 */

type ReactotronType = ReactotronReactNative & {
  createEnhancer?: () => any;
};

let reactotron: ReactotronType;

if (Config.ENV === 'dev') {
  reactotron = Reactotron.configure({
    name: 'MindLogger Mobile',
    host: 'localhost', // Change if using physical device
  })
    .useReactNative({
      asyncStorage: false, // We use MMKV, not AsyncStorage
      networking: {
        // Ignore React Native internal requests
        ignoreUrls: /symbolicate|logs|inspector/,
      },
      editor: false, // Disable opening editor
      overlay: true, // Enable error/warning overlay
      errors: {
        veto: () => false, // Show all errors
      },
    })
    .use(
      reactotronRedux({
        // Only send state snapshots when explicitly requested
        // to avoid performance issues with large states
        onRestore: state => {
          console.log('[Reactotron] Redux state restored:', state);
        },
      }),
    ) as any;

  // Configure MMKV tracking after all plugins are added
  configureMMKVTracking(reactotron as any);

  // Connect to Reactotron desktop app
  reactotron.connect();

  // Clear Reactotron on app reload for a fresh start
  reactotron.clear?.();

  console.log('[Reactotron] Connected successfully');
} else {
  // Provide no-op implementation for non-dev environments
  reactotron = {
    configure: () => reactotron,
    useReactNative: () => reactotron,
    use: () => reactotron,
    connect: () => reactotron,
    clear: () => {},
    createEnhancer: () => (next: any) => next,
    display: () => {},
    log: () => {},
    warn: () => {},
    error: () => {},
    logImportant: () => {},
  } as any;
}

export default reactotron;
