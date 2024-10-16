import { configureStore } from '@reduxjs/toolkit';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage
import authReducer from './slice/authSlice';
import productsReducer from './slice/productsSlice';
import transitionReducer from './slice/transitionSlice';

// Persist config for auth reducer
const persistConfig = {
  key: 'auth', // Key for the persisted state
  storage, // Storage method (localStorage)
};

// Create a persisted reducer for auth
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure the store with persisted auth reducer
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Use the persisted auth reducer
    products: productsReducer, // Regular products reducer
    transition: transitionReducer // Regular transition reducer
  },
  middleware: (getdefaultMiddleWare) => getdefaultMiddleWare({
    serializableCheck: false
  })
});

// Create the persistor
export const persistor = persistStore(store);