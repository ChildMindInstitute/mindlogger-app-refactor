import { LogBox, StyleSheet } from 'react-native';

import Animated, { LinearTransition } from 'react-native-reanimated';

import { Banners } from '@app/entities/banner/ui/Banners';
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

jobRunner.runAll([localization]).catch(console.error);

getDefaultLogger().configure();

const App = () => {
  return (
    <AppProvider>
      <Banners />
      {/* Wrap RootNavigator with Animated.View for smooth banner transitions */}
      <Animated.View layout={LinearTransition} style={styles.container}>
        <RootNavigator />
      </Animated.View>
    </AppProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
