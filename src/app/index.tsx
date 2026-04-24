import { LogBox, StyleSheet } from 'react-native';

import {
  BatchSize,
  DatadogProvider,
  DatadogProviderConfiguration,
  PropagatorType,
  SdkVerbosity,
  TrackingConsent,
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
  DATADOG_CLIENT_TOKEN,
  DATADOG_ENV,
  APP_VERSION,
} from '@shared/lib/constants';

import { AppProvider } from './ui/AppProvider';

const hideIosSimulatorErrorWarningBadges = true;

if (hideIosSimulatorErrorWarningBadges) {
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
}

jobRunner.runAll([localization]).catch(console.error);

getDefaultLogger().configure();

const buildFirstPartyHosts = (firstPartyHosts: string[]) => {
  return firstPartyHosts.map(it => {
    return {
      match: it,
      propagatorTypes: [PropagatorType.DATADOG, PropagatorType.TRACECONTEXT],
    };
  });
};

const config = new DatadogProviderConfiguration(
  DATADOG_CLIENT_TOKEN,
  DATADOG_ENV as string,
  TrackingConsent.GRANTED,
  {
    rumConfiguration: {
      applicationId: DATADOG_APPLICATION_ID,
      sessionSampleRate: 100,
      trackInteractions: false,
      trackFrustrations: true,
      trackResources: true,
      nativeCrashReportEnabled: true,
      longTaskThresholdMs: 100,
      firstPartyHosts: buildFirstPartyHosts([
        'api-v2.mindlogger.org',
        'api-v2.gettingcurious.com',
        'api-dev.cmiml.net',
        'api-uat.cmiml.net',
        'api-prod.cmiml.net',
      ]),
    },
    logsConfiguration: {
      bundleLogsWithRum: true,
      bundleLogsWithTraces: true,
    },
    traceConfiguration: {},
  },
);

config.site = 'US1';
config.service = 'mindlogger-mobile';
config.version = APP_VERSION;

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
