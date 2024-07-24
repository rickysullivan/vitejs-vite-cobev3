import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

import type { Slice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Branch {
  id: number;
  name: string;
  location: string;
}

const branchesAdapter = createEntityAdapter<Branch>();

export const fetchBranches = createAsyncThunk<Branch[], void, { rejectValue: string }>("branches/fetchBranches", async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockedBranches = [
      { id: 1, name: "Branch A", location: "City A" },
      { id: 2, name: "Branch B", location: "City B" },
      { id: 3, name: "Branch C", location: "City C" },
    ];

    return mockedBranches;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

const branchesSlice: Slice = createSlice({
  name: "branches",
  initialState: branchesAdapter.getInitialState({
    loading: false,
    error: null as string | null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        branchesAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

const branchesSelectorsGlobalized = {
  ...branchesAdapter.getSelectors((state: RootState) => state.entities.branches),
  selectBranchById: (state: RootState, { id }: { id: number }) => branchesSelectorsGlobalized.selectById(state, id),
};

export const { selectIds: selectBranchIds, selectEntities: selectBranchesEntities, selectAll: selectAllBranches, selectTotal: selectBranchesTotal, selectBranchById } = branchesSelectorsGlobalized;

export default branchesSlice;
