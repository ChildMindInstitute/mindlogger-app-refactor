import { LogBox } from 'react-native';

import { RootNavigator } from '@screens';

import localization from '@jobs/localization';
import { Logger, jobRunner } from '@shared/lib';

import { AppProvider } from './ui';

const hideIosSimulatorErrorWarningBadges = true;

if (hideIosSimulatorErrorWarningBadges) {
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
}

jobRunner.runAll([localization]);

Logger.configure();

const App = () => {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
};

export default App;
