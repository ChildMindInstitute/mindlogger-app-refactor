import '@shared/lib/i18n';
import { initializeLocalization } from '@shared/lib/i18n';

import AppProvider from './providers';
import Screens from '@screens';

initializeLocalization();

const App = () => {
  return (
    <AppProvider>
      <Screens />
    </AppProvider>
  );
};

export default App;
