import { LogBox } from 'react-native';

import { RootNavigator } from '@screens';

import localization from '@jobs/localization';
import { Logger, jobRunner, AnalyticsService } from '@shared/lib';

import { AppProvider } from './ui';

const hideIosSimulatorErrorWarningBadges = true;

if (hideIosSimulatorErrorWarningBadges) {
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
}

jobRunner.runAll([localization]);

Logger.configure();

AnalyticsService.init();

const App = () => {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
};

export default App;
