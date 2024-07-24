import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

import type { Slice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Site {
  id: number;
  name: string;
  url: string;
}

export interface UpdateSitePayload {
  id: number;
  changes: Partial<Omit<Site, "id">>;
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

export const fetchSite = createAsyncThunk<Site, number, { rejectValue: string }>("sites/fetchSite", async (id, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const mockedSite = { id, name: `Site ${id}`, url: `https://site${id}.com` };
    return mockedSite;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

export const deleteSite = createAsyncThunk<number, number, { rejectValue: string }>("sites/deleteSite", async (id, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

export const updateSite = createAsyncThunk<Site, UpdateSitePayload, { rejectValue: string }>("sites/updateSite", async ({ id, changes }, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const updatedSite: Site = { id, name: `Updated Site ${id}`, url: `https://updatedsite${id}.com`, ...changes };
    return updatedSite;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

const sitesSlice: Slice = createSlice({
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
      })
      .addCase(fetchSite.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSite.fulfilled, (state, action) => {
        sitesAdapter.upsertOne(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      })
      .addCase(deleteSite.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSite.fulfilled, (state, action) => {
        sitesAdapter.removeOne(state, action.payload);
        state.loading = false;
      })
      .addCase(deleteSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      })
      .addCase(updateSite.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSite.fulfilled, (state, action) => {
        sitesAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
        state.loading = false;
      })
      .addCase(updateSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

const sitesSelectorsGlobalized = {
  ...sitesAdapter.getSelectors((state: RootState) => state.entities.sites),
  selectSiteById: (state: RootState, { id }: { id: number }) => sitesSelectorsGlobalized.selectById(state, id),
};

export const { selectIds: selectSiteIds, selectEntities: selectSitesEntities, selectAll: selectAllSites, selectTotal: selectSitesTotal, selectSiteById } = sitesSelectorsGlobalized;

export default sitesSlice;
