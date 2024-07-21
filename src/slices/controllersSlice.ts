import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

import type { AppDispatch, RootState } from "../store";

export interface Controller {
  id: number;
  name: string;
  status: string;
}

const controllersAdapter = createEntityAdapter<Controller>();

export const fetchControllers = createAsyncThunk<Controller[], void, { rejectValue: string }>("controllers/fetchControllers", async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockedControllers = [
      { id: 1, name: "Controller A", status: "connected" },
      { id: 2, name: "Controller B", status: "disconnected" },
      { id: 3, name: "Controller C", status: "connected" },
    ];

    return mockedControllers;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

export const initSlice = () => async (dispatch: AppDispatch) => {
  await dispatch(fetchControllers());
};

const controllersSlice = createSlice({
  name: "controllers",
  initialState: controllersAdapter.getInitialState({
    loading: false,
    error: null as string | null,
    selectedControllerId: null as number | null,
  }),
  reducers: {
    setSelectedController: (state, action) => {
      state.selectedControllerId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchControllers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchControllers.fulfilled, (state, action) => {
        controllersAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchControllers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

const controllersSelectorsGlobalized = {
  ...controllersAdapter.getSelectors((state: RootState) => state.components.controllers),
  selectControllerById: (state: RootState, { id }: { id: number }) => controllersSelectorsGlobalized.selectById(state, id),
};

export const { selectIds: selectControllerIds, selectEntities: selectControllersEntities, selectAll: selectAllControllers, selectTotal: selectControllersTotal, selectControllerById } = controllersSelectorsGlobalized;

export const { setSelectedController } = controllersSlice.actions;

export default controllersSlice.reducer;
