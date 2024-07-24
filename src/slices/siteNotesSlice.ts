import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

import type { Slice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface SiteNote {
  id: number;
  siteId: number;
  content: string;
  createdAt: string;
  createdBy: number;
}

const siteNotesAdapter = createEntityAdapter<SiteNote>();

export const fetchSiteNotes = createAsyncThunk<SiteNote[], void, { rejectValue: string }>("siteNotes/fetchSiteNotes", async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockedSiteNotes = [
      { id: 1, siteId: 1, content: "Maintenance scheduled for next week", createdAt: "2023-04-20T10:30:00Z", createdBy: 1 },
      { id: 2, siteId: 1, content: "New security protocol implemented", createdAt: "2023-04-21T14:15:00Z", createdBy: 2 },
      { id: 3, siteId: 2, content: "Staff training completed", createdAt: "2023-04-22T09:00:00Z", createdBy: 1 },
    ];

    return mockedSiteNotes;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

const siteNotesSlice: Slice = createSlice({
  name: "siteNotes",
  initialState: siteNotesAdapter.getInitialState({
    loading: false,
    error: null as string | null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSiteNotes.fulfilled, (state, action) => {
        siteNotesAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchSiteNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

const siteNotesSelectorsGlobalized = {
  ...siteNotesAdapter.getSelectors((state: RootState) => state.entities.siteNotes),
  selectSiteNoteById: (state: RootState, { id }: { id: number }) => siteNotesSelectorsGlobalized.selectById(state, id),
};

export const { selectIds: selectSiteNoteIds, selectEntities: selectSiteNotesEntities, selectAll: selectAllSiteNotes, selectTotal: selectSiteNotesTotal, selectSiteNoteById } = siteNotesSelectorsGlobalized;

export default siteNotesSlice;
