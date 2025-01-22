import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import postReducer from './slices/postSlice';
import userReducer from './slices/userSlice';
import canvasReducer from './slices/canvasSlice';

const rootReducer = combineReducers({
  post: postReducer,
  user: userReducer,
  canvas: canvasReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export const persistor = persistStore(store);
export default store;
