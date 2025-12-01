import { LogBox, StyleSheet } from 'react-native';

import {
  BatchSize,
  DatadogProvider,
  DatadogProviderConfiguration,
  SdkVerbosity,
  UploadFrequency,
} from '@datadog/mobile-react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { Banners } from '@app/entities/banner/ui/Banners';
import { RootNavigator } from '@app/screens/ui/RootNavigator';
import { jobRunner } from '@app/shared/lib/services/jobManagement';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import localization from '@jobs/localization';
import {
  DATADOG_APPLICATION_ID,
  DATDOG_CLIENT_TOKEN,
  ENV,
} from '@shared/lib/constants';

import { AppProvider } from './ui/AppProvider';

const hideIosSimulatorErrorWarningBadges = true;

if (hideIosSimulatorErrorWarningBadges) {
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
}

jobRunner.runAll([localization]).catch(console.error);

getDefaultLogger().configure();

const config = new DatadogProviderConfiguration(
  DATDOG_CLIENT_TOKEN,
  ENV as string,
  DATADOG_APPLICATION_ID,
  true, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
  true, // track XHR Resources
  true, // track Errors
);

config.site = 'US1';
// Optional: Enable JavaScript long task collection
config.longTaskThresholdMs = 100;
// Optional: enable or disable native crash reports
config.nativeCrashReportEnabled = true;
// Optional: sample RUM sessions (here, 100% of session will be sent to Datadog. Default = 100%. Only tracked sessions send RUM events.)
config.sessionSamplingRate = 100;

if (__DEV__) {
  // Optional: Send data more frequently
  config.uploadFrequency = UploadFrequency.FREQUENT;
  // Optional: Send smaller batches of data
  config.batchSize = BatchSize.SMALL;
  // Optional: Enable debug logging
  config.verbosity = SdkVerbosity.DEBUG;
}

const App = () => {
  return (
    <DatadogProvider configuration={config}>
      <AppProvider>
        <Banners />
        {/* Wrap RootNavigator with Animated.View for smooth banner transitions */}
        <Animated.View layout={LinearTransition} style={styles.container}>
          <RootNavigator />
        </Animated.View>
      </AppProvider>
    </DatadogProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
