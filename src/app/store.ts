import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import startReducer from '../components/startSlice';

export const store = configureStore({
  reducer: {
    start: startReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
