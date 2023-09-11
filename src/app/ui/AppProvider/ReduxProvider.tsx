import { FC, PropsWithChildren } from 'react';

import {
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { AppletModel } from '@entities/applet';
import { IdentityModel } from '@entities/identity';
import { LiveConnectionModel } from '@entities/liveConnection';
import { createAsyncStorage, useSplash } from '@shared/lib';

const storage = createAsyncStorage('redux-storage');

export const persistConfig = {
  key: 'root',
  storage: storage,
};

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === 'identity/onLogout') {
    state = undefined;
  }

  const reducer = combineReducers({
    identity: IdentityModel.reducer,
    applets: AppletModel.reducer,
    liveConnection: LiveConnectionModel.reducer,
  });

  return reducer(state, action);
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer,
) as typeof rootReducer;

export const reduxStore = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({ serializableCheck: false });
    if (__DEV__) {
      const createDebugger = require('redux-flipper').default;
      middlewares.push(createDebugger());
    }
    return middlewares;
  },
});

const persistor = persistStore(reduxStore);

const ReduxProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized } = useSplash();

  const onBeforeLift = () => {
    onModuleInitialized('state');
  };

  return (
    <Provider store={reduxStore}>
      <PersistGate persistor={persistor} onBeforeLift={onBeforeLift}>
        {children}
      </PersistGate>
    </Provider>
  );
};

declare global {
  type RootState = ReturnType<typeof reduxStore.getState>;
  type AppDispatch = typeof reduxStore.dispatch;
  type AppThunkAction = ThunkAction<void, RootState, unknown, AnyAction>;
}

export default ReduxProvider;
