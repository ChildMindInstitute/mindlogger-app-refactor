import { FC, PropsWithChildren } from 'react';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { IdentityModel } from '@app/entities/identity';

const createDebugger = require('redux-flipper').default;

export const reduxStore = configureStore({
  reducer: { identityReducer: IdentityModel.slices.identityReducer },
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({ serializableCheck: false });
    middlewares.push(createDebugger());
    return middlewares;
  },
});

const ReduxProvider: FC<PropsWithChildren> = ({ children }) => (
  <Provider store={reduxStore}>{children}</Provider>
);

export default ReduxProvider;
