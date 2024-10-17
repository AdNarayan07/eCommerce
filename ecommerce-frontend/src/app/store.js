import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import authReducer from './slice/authSlice';
import productsReducer from './slice/productsSlice';
import transitionReducer from './slice/transitionSlice';

// Persist configuration for the auth reducer
const persistConfig = {
  key: 'auth', // Key for the persisted state in storage
  storage, // Storage method (localStorage)
};

// Persisted auth reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Use the persisted auth reducer
    products: productsReducer, // Standard products reducer
    transition: transitionReducer, // Standard transition reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values
    }),
});

// Create the persistor for the store
export const persistor = persistStore(store);
