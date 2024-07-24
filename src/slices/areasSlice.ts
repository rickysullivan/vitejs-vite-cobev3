import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

import type { Slice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Area {
  id: number;
  name: string;
  areaGroupId: number;
}

const areasAdapter = createEntityAdapter<Area>();

export const fetchAreas = createAsyncThunk<Area[], void, { rejectValue: string }>("areas/fetchAreas", async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockedAreas = [
      { id: 1, name: "Area 1", areaGroupId: 1 },
      { id: 2, name: "Area 2", areaGroupId: 1 },
      { id: 3, name: "Area 3", areaGroupId: 2 },
    ];

    return mockedAreas;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

const areasSlice: Slice = createSlice({
  name: "areas",
  initialState: areasAdapter.getInitialState({
    loading: false,
    error: null as string | null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        areasAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

const areasSelectorsGlobalized = {
  ...areasAdapter.getSelectors((state: RootState) => state.entities.areas),
  selectAreaById: (state: RootState, { id }: { id: number }) => areasSelectorsGlobalized.selectById(state, id),
};

export const { selectIds: selectAreaIds, selectEntities: selectAreasEntities, selectAll: selectAllAreas, selectTotal: selectAreasTotal, selectAreaById } = areasSelectorsGlobalized;

export default areasSlice;
