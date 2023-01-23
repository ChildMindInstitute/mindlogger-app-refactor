import Screens from '@screens';

import localization from '@jobs/localization';
import requestInterception from '@jobs/request-interception';
import responseInterception from '@jobs/response-interception';
import { jobRunner } from '@shared/lib';

import { AppProvider } from './ui';

jobRunner.runAll([localization, requestInterception, responseInterception]);

const App = () => {
  return (
    <AppProvider>
      <Screens />
    </AppProvider>
  );
};

export default App;
