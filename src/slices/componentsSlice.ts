import { combineSlices, createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { featureFlagConfig, injectFeatureFlaggedSlices } from "../featureFlags";

import { selectAllSites } from "./sitesSlice";
import { selectAllControllers } from "./controllersSlice";
import { selectAllDoors } from "./doorsSlice";

import type { AppDispatch, RootState } from "../store";

import { initSlice as initControllersSlice } from "./controllersSlice";
import { initSlice as initSitesSlice } from "./sitesSlice";
import { initSlice as initDoorsSlice } from "./doorsSlice";

const sliceInitActions: Record<string, () => any> = {
  controllers: initControllersSlice,
  sites: initSitesSlice,
  doors: initDoorsSlice,
};

export const fetchAllComponents = createAsyncThunk<Record<string, any>, void, { dispatch: AppDispatch; state: RootState }>("components/fetchAllComponents", async (_, { dispatch }) => {
  const enabledSlices = Object.keys(sliceInitActions).filter((key) => featureFlagConfig[key]?.isEnabled);

  const results = await Promise.allSettled(enabledSlices.map((key) => dispatch(sliceInitActions[key as keyof typeof sliceInitActions]())));

  const successfulResults = enabledSlices.reduce<Record<string, any>>((acc, key, index) => {
    const result = results[index];
    if (result.status === "fulfilled") {
      acc[key] = result.value;
    } else {
      console.error(`Failed to initialize ${key}:`, result.reason);
      acc[key] = null;
    }
    return acc;
  }, {});

  return successfulResults;
});

const initialState = {
  loading: false,
  error: null as string | null,
};

const componentsMetaSlice = createSlice({
  name: "componentsMeta",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllComponents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllComponents.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAllComponents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export interface LazyLoadedSlices {}

const baseComponentsSlice = combineSlices({
  meta: componentsMetaSlice.reducer,
}).withLazyLoadedSlices<LazyLoadedSlices>();

export const updateComponentsSlice = ({ replaced, newConfig }: { replaced?: boolean; newConfig?: Partial<typeof featureFlagConfig> }) => {
  return injectFeatureFlaggedSlices(baseComponentsSlice, featureFlagConfig, { replaced, newConfig });
};

let componentsSlice = updateComponentsSlice({ replaced: false });

export default componentsSlice;

const selectorMap: Record<string, (state: RootState) => any> = {
  sites: selectAllSites,
  controllers: selectAllControllers,
  doors: selectAllDoors,
};

export const selectAllComponents = createSelector([(state: RootState) => state, (state: RootState) => state.components.meta], (state, meta) => {
  const components: Record<string, any> = { meta };

  Object.entries(featureFlagConfig).forEach(([key, { isEnabled }]) => {
    if (isEnabled && state.components[key] && selectorMap[key]) {
      components[key] = selectorMap[key](state);
    }
  });

  return components;
});
