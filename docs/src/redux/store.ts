import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { personStoreFilterConfigSlice, personStoreSearchSlice } from '../modules/person';

export const store = configureStore({
  reducer: {
    search: personStoreSearchSlice.reducer,
    filterConfig: personStoreFilterConfigSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
