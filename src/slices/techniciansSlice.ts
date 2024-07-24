import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

import type { Slice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Technician {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const techniciansAdapter = createEntityAdapter<Technician>();

export const fetchTechnicians = createAsyncThunk<Technician[], void, { rejectValue: string }>("technicians/fetchTechnicians", async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockedTechnicians = [
      { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "456-789-0123" },
    ];

    return mockedTechnicians;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

const techniciansSlice: Slice = createSlice({
  name: "technicians",
  initialState: techniciansAdapter.getInitialState({
    loading: false,
    error: null as string | null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTechnicians.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTechnicians.fulfilled, (state, action) => {
        techniciansAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchTechnicians.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

const techniciansSelectorsGlobalized = {
  ...techniciansAdapter.getSelectors((state: RootState) => state.entities.technicians),
  selectTechnicianById: (state: RootState, { id }: { id: number }) => techniciansSelectorsGlobalized.selectById(state, id),
};

export const { selectIds: selectTechnicianIds, selectEntities: selectTechniciansEntities, selectAll: selectAllTechnicians, selectTotal: selectTechniciansTotal, selectTechnicianById } = techniciansSelectorsGlobalized;

export default techniciansSlice;
