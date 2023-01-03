import Screens from '@screens';

import { initializeLocalization } from '@shared/lib/i18n';

import AppProvider from './providers';

initializeLocalization();

const App = () => {
  return (
    <AppProvider>
      <Screens />
    </AppProvider>
  );
};

export default App;
