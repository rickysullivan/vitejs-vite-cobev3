import { createSlice, createAsyncThunk, createSelector, combineSlices } from "@reduxjs/toolkit";

import type { Slice } from "@reduxjs/toolkit";
import type { Reducer } from "@reduxjs/toolkit";

import sitesSlice, { fetchSites, selectAllSites } from "./sitesSlice";
import controllersSlice, { fetchControllers, selectAllControllers } from "./controllersSlice";
import doorsSlice, { fetchDoors, selectAllDoors } from "./doorsSlice";
import branchesSlice, { fetchBranches, selectAllBranches } from "./branchesSlice";
import areaGroupsSlice, { fetchAreaGroups, selectAllAreaGroups } from "./areaGroupsSlice";
import areasSlice, { fetchAreas, selectAllAreas } from "./areasSlice";
import eventsSlice, { fetchEvents, selectAllEvents } from "./eventsSlice";
import siteNotesSlice, { fetchSiteNotes, selectAllSiteNotes } from "./siteNotesSlice";
import techniciansSlice, { fetchTechnicians, selectAllTechnicians } from "./techniciansSlice";

import type { AppDispatch } from "../store";

export const fetchAllEntities = createAsyncThunk<Record<string, any>, void, { dispatch: AppDispatch }>("entities/fetchAllEntities", async (_, { dispatch }) => {
  const fetchActions = {
    sites: fetchSites(),
    controllers: fetchControllers(),
    doors: fetchDoors(),
    branches: fetchBranches(),
    areaGroups: fetchAreaGroups(),
    areas: fetchAreas(),
    events: fetchEvents(),
    siteNotes: fetchSiteNotes(),
    technicians: fetchTechnicians(),
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

const entitiesMetaSlice: Slice = createSlice({
  name: "meta",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEntities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEntities.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAllEntities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const selectAllEntities = createSelector([selectAllSites, selectAllControllers, selectAllDoors, selectAllBranches, selectAllAreaGroups, selectAllAreas, selectAllEvents, selectAllSiteNotes, selectAllTechnicians], (sites, controllers, doors, branches, areaGroups, areas, events, siteNotes, technicians) => ({
  sites,
  controllers,
  doors,
  branches,
  areaGroups,
  areas,
  events,
  siteNotes,
  technicians,
}));

const entitiesSlice: Reducer = combineSlices(entitiesMetaSlice, sitesSlice, controllersSlice, doorsSlice, branchesSlice, areaGroupsSlice, areasSlice, eventsSlice, siteNotesSlice, techniciansSlice);

export default entitiesSlice;
