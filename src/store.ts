import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { updateComponentsSlice } from "./slices/componentsSlice";
import { featureFlagConfig, updateFeatureFlags as updateFlags } from "./featureFlags";

const createRootReducer = ({ replaced, newConfig }: { replaced?: boolean; newConfig?: Partial<typeof featureFlagConfig> }) => {
  const componentsReducer = updateComponentsSlice({ replaced, newConfig });
  return combineReducers({
    components: componentsReducer,
  });
};

const store = configureStore({
  reducer: createRootReducer({ replaced: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const updateFeatureFlags = (newConfig: Partial<typeof featureFlagConfig>) => {
  updateFlags(newConfig);
  store.replaceReducer(createRootReducer({ replaced: true, newConfig }));
};

export default store;
