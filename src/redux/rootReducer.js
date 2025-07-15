import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
// لو عندك أكثر من slice ضيفهم هنا

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
