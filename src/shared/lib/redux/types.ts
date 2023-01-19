import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { reduxStore } from '@app/app/providers';

export type RootState = ReturnType<typeof reduxStore.getState>;

export type AppDispatch = typeof reduxStore.dispatch;

export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;

export const useThunkDispatch = () => useDispatch<ThunkAppDispatch>;
