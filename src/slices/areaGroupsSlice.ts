import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

import type { RootState } from "../store";

export interface AreaGroup {
  id: number;
  name: string;
  siteId: number;
}

const areaGroupsAdapter = createEntityAdapter<AreaGroup>();

export const fetchAreaGroups = createAsyncThunk<AreaGroup[], void, { rejectValue: string }>("areaGroups/fetchAreaGroups", async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockedAreaGroups = [
      { id: 1, name: "Area Group A", siteId: 1 },
      { id: 2, name: "Area Group B", siteId: 1 },
      { id: 3, name: "Area Group C", siteId: 2 },
    ];

    return mockedAreaGroups;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

const areaGroupsSlice = createSlice({
  name: "areaGroups",
  initialState: areaGroupsAdapter.getInitialState({
    loading: false,
    error: null as string | null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreaGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAreaGroups.fulfilled, (state, action) => {
        areaGroupsAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchAreaGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

const areaGroupsSelectorsGlobalized = {
  ...areaGroupsAdapter.getSelectors((state: RootState) => state.entities.areaGroups),
  selectAreaGroupById: (state: RootState, { id }: { id: number }) => areaGroupsSelectorsGlobalized.selectById(state, id),
};

export const { selectIds: selectAreaGroupIds, selectEntities: selectAreaGroupsEntities, selectAll: selectAllAreaGroups, selectTotal: selectAreaGroupsTotal, selectAreaGroupById } = areaGroupsSelectorsGlobalized;

export default areaGroupsSlice.reducer;
