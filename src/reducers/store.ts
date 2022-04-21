import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from './rootReducer';

const addMiddleware = process.env.NODE_ENV !== 'production' ? [logger] : [];
const middleware = [...getDefaultMiddleware(), ...addMiddleware];

export default configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: middleware,
});
