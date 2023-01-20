import { FC, PropsWithChildren } from 'react';

import {
  Action,
  combineReducers,
  configureStore,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { IdentityModel } from '@entities/identity';

const rootReducer = combineReducers({
  identity: IdentityModel.reducer,
});

export const reduxStore = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({ serializableCheck: false });
    if (__DEV__) {
      const createDebugger = require('redux-flipper').default;
      middlewares.push(createDebugger());
    }
    return middlewares;
  },
});

const ReduxProvider: FC<PropsWithChildren> = ({ children }) => (
  <Provider store={reduxStore}>{children}</Provider>
);

declare global {
  type RootState = ReturnType<typeof reduxStore.getState>;
  type AppDispatch = typeof reduxStore.dispatch;
  type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;
}

export default ReduxProvider;
