import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import reminderReducer from './slices/reminderSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reminders: reminderReducer,
    toast: toastReducer,
  },
});

