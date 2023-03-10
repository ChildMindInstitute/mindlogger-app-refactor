import { FC, PropsWithChildren } from 'react';

import {
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { persistReducer, persistStore, createTransform } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { IdentityModel } from '@entities/identity';
import { createAsyncStorage, useSplash } from '@shared/lib';

const storage = createAsyncStorage('redux-storage');

const DateKeys = ['startAt', 'endAt'];
const DateTransform = createTransform(
  inboundState => inboundState,
  (outboundState: any, key) => {
    if (DateKeys.includes(key.toString())) {
      return { ...outboundState, [key]: new Date(outboundState[key]) };
    } else {
      return outboundState;
    }
  },
);

export const persistConfig = {
  key: 'root',
  storage: storage,
  transforms: [DateTransform],
};

const rootReducer = combineReducers({
  identity: IdentityModel.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

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
