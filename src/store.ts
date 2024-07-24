import { configureStore } from "@reduxjs/toolkit";

import entitiesReducer from "./slices/entitiesSlice";

const store = configureStore({
  reducer: {
    entities: entitiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
