/**
 * @format
 */

import React from 'react';
import { Routing } from './src/screens';
import { AppProvider } from './src/app';
import './src/app/i18n';

const App = () => {
  return (
    <AppProvider>
      <Routing />
    </AppProvider>
  );
};

export default App;
