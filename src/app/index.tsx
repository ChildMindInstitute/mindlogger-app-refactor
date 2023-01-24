import Screens from '@screens';

import localization from '@jobs/localization';
import { jobRunner } from '@shared/lib';

import { AppProvider } from './ui';

jobRunner.runAll([localization]);

const App = () => {
  return (
    <AppProvider>
      <Screens />
    </AppProvider>
  );
};

export default App;
