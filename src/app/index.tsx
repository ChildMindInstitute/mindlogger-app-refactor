import React from 'react';
import { Routing } from '@screens';
import AppProvider from './providers';
import '@shared/lib/i18n';

const App = () => {
  return (
    <AppProvider>
      <Routing />
    </AppProvider>
  );
};

export default App;
