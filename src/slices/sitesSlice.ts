import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

import type { AppDispatch, RootState } from "../store";

export interface Site {
  id: number;
  name: string;
  url: string;
}

const sitesAdapter = createEntityAdapter<Site>();

export const fetchSites = createAsyncThunk<Site[], void, { rejectValue: string }>("sites/fetchSites", async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockedSites = [
      { id: 1, name: "Site A", url: "https://sitea.com" },
      { id: 2, name: "Site B", url: "https://siteb.com" },
      { id: 3, name: "Site C", url: "https://sitec.com" },
    ];

    return mockedSites;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

const sitesSlice = createSlice({
  name: "sites",
  initialState: sitesAdapter.getInitialState({
    loading: false,
    error: null as string | null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        sitesAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

const sitesSelectorsGlobalized = {
  ...sitesAdapter.getSelectors((state: RootState) => state.components.sites),
  selectSiteById: (state: RootState, { id }: { id: number }) => sitesSelectorsGlobalized.selectById(state, id),
};

export const { selectIds: selectSiteIds, selectEntities: selectSitesEntities, selectAll: selectAllSites, selectTotal: selectSitesTotal, selectSiteById } = sitesSelectorsGlobalized;

export const initSlice = () => async (dispatch: AppDispatch) => {
  await dispatch(fetchSites());
};

export default sitesSlice.reducer;
