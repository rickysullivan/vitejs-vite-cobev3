import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

import type { RootState } from "../store";

export interface Door {
  id: number;
  name: string;
  status: string;
}

const doorsAdapter = createEntityAdapter<Door>();

export const fetchDoors = createAsyncThunk<Door[], void, { rejectValue: string }>("doors/fetchDoors", async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockedDoors = [
      { id: 1, name: "Front Door", status: "closed" },
      { id: 2, name: "Back Door", status: "open" },
      { id: 3, name: "Garage Door", status: "closed" },
    ];

    return mockedDoors;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

const doorsSlice = createSlice({
  name: "doors",
  initialState: doorsAdapter.getInitialState({
    loading: false,
    error: null as string | null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoors.fulfilled, (state, action) => {
        doorsAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchDoors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

const doorsSelectorsGlobalized = {
  ...doorsAdapter.getSelectors((state: RootState) => state.components.doors),
  selectDoorById: (state: RootState, { id }: { id: number }) => doorsSelectorsGlobalized.selectById(state, id),
};

export const { selectIds: selectDoorIds, selectEntities: selectDoorsEntities, selectAll: selectAllDoors, selectTotal: selectDoorsTotal, selectDoorById } = doorsSelectorsGlobalized;

export default doorsSlice.reducer;
