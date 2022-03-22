import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { filterReducer } from '../modules/person';

export const store = configureStore({
  reducer: {
    filters: filterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>()