import { FC, PropsWithChildren } from 'react';

import {
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import { Provider } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { migrateReduxStore } from '@app/app/model/migrations/MigrationProcessor';
import { appletReducer } from '@app/entities/applet/model/slice';
import { bannerReducer } from '@app/entities/banner/model/slice';
import { defaultBannersReducer } from '@app/entities/defaultBanners/model/slice';
import { identityReducer } from '@app/entities/identity/model/slice';
import { streamingReducer } from '@app/entities/streaming/model/slice';
import { useSystemBootUp } from '@app/shared/lib/contexts/SplashContext';
import { createAsyncStorage } from '@app/shared/lib/storages/createStorage';
import Reactotron from '@shared/config/reactotron.config';

const storage = createAsyncStorage('redux-storage');

export const persistConfig = {
  key: 'root',
  throttle: 1000,
  storage,
  // Exclude banners from persistence
  blacklist: ['banners'],
};

const rootReducer = (state: any, action: AnyAction) => {
  if (migrateReduxStore.match(action)) {
    state = action.payload;
  }

  const reducer = combineReducers({
    identity: identityReducer,
    applets: appletReducer,
    streaming: streamingReducer,
    banners: bannerReducer,
    defaultBanners: defaultBannersReducer,
  });

  return reducer(state, action);
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer,
) as typeof rootReducer;

export const reduxStore = configureStore({
  reducer: persistedReducer,
  enhancers: getDefaultEnhancers => {
    const enhancers = getDefaultEnhancers();

    // Add Reactotron enhancer in dev environment only
    if (Config.ENV === 'dev' && Reactotron.createEnhancer) {
      return enhancers.concat(Reactotron.createEnhancer());
    }

    return enhancers;
  },
});

export const persistor = persistStore(reduxStore);

export const ReduxProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized, initialized } = useSystemBootUp();

  const onBeforeLift = () => {
    onModuleInitialized('state');
  };

  return (
    <Provider store={reduxStore}>
      <PersistGate persistor={persistor} onBeforeLift={onBeforeLift}>
        {initialized && children}
      </PersistGate>
    </Provider>
  );
};

declare global {
  type RootState = ReturnType<typeof reduxStore.getState>;
  type AppDispatch = typeof reduxStore.dispatch;
  type AppThunkAction = ThunkAction<void, RootState, unknown, AnyAction>;
}
