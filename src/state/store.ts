import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
  PayloadAction,
} from "@reduxjs/toolkit";
import soundReducer from "./sound/soundSlice";

const appReducer = combineReducers({
  sound: soundReducer,
});

const rootReducer = (state: any, action: PayloadAction<any>) => {
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
