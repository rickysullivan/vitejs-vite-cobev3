import { createSlice, createAsyncThunk, combineSlices, createSelector } from "@reduxjs/toolkit";

import type { Reducer } from "@reduxjs/toolkit";

import sitesReducer, { fetchSites, selectAllSites } from "./sitesSlice";
import controllersReducer, { fetchControllers, selectAllControllers } from "./controllersSlice";
import doorsReducer, { fetchDoors, selectAllDoors } from "./doorsSlice";
import type { AppDispatch } from "../store";

export const fetchAllComponents = createAsyncThunk<Record<string, any>, void, { dispatch: AppDispatch }>("components/fetchAllComponents", async (_, { dispatch }) => {
  const fetchActions = {
    sites: fetchSites(),
    controllers: fetchControllers(),
    doors: fetchDoors(),
  };

  const results = await Promise.allSettled(Object.entries(fetchActions).map(([_, action]) => dispatch(action as AppDispatch)));

  const successfulResults = Object.keys(fetchActions).reduce<Record<string, any>>((acc, key, index) => {
    const result = results[index];
    if (result.status === "fulfilled") {
      acc[key] = result.value.payload;
    } else {
      console.error(`Failed to fetch ${key}:`, result.reason);
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
  name: "components",
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
        state.error = action.error.message || null;
      });
  },
});

export const selectAllComponents = createSelector([selectAllSites, selectAllControllers, selectAllDoors], (sites, controllers, doors) => ({ sites, controllers, doors }));

const { reducer: componentsMetaReducer } = componentsMetaSlice;

const componentsSlice: Reducer = combineSlices({
  meta: componentsMetaReducer,
  sites: sitesReducer,
  controllers: controllersReducer,
  doors: doorsReducer,
});

export default componentsSlice;
