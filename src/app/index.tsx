import Screens from '@screens';

import { AppProvider } from './ui';

const App = () => {
  return (
    <AppProvider>
      <Screens />
    </AppProvider>
  );
};

export default App;
