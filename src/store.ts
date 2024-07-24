import { configureStore } from "@reduxjs/toolkit";

import entitiesSlice from "./slices/entitiesSlice";

const store = configureStore({
  reducer: {
    entities: entitiesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
