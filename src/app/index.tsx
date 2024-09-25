import { LogBox } from 'react-native';

import { RootNavigator } from '@app/screens/ui/RootNavigator';
import { jobRunner } from '@app/shared/lib/services/jobManagement';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import localization from '@jobs/localization';

import { AppProvider } from './ui/AppProvider';

const hideIosSimulatorErrorWarningBadges = true;

if (hideIosSimulatorErrorWarningBadges) {
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
}

jobRunner.runAll([localization]);

getDefaultLogger().configure();

const App = () => {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
};

export default App;
