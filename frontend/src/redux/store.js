import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import preferencesReducer from "./slices/preferencesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
  },
});
