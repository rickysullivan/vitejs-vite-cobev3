import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

import type { RootState } from "../store";

export interface Event {
  id: number;
  type: string;
  timestamp: string;
  entityId: number;
  entityType: string;
}

const eventsAdapter = createEntityAdapter<Event>();

export const fetchEvents = createAsyncThunk<Event[], void, { rejectValue: string }>("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockedEvents = [
      { id: 1, type: "Door Opened", timestamp: "2023-04-20T10:30:00Z", entityId: 1, entityType: "door" },
      { id: 2, type: "Controller Offline", timestamp: "2023-04-20T11:15:00Z", entityId: 2, entityType: "controller" },
      { id: 3, type: "Area Access Granted", timestamp: "2023-04-20T12:00:00Z", entityId: 1, entityType: "area" },
    ];

    return mockedEvents;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
  }
});

const eventsSlice = createSlice({
  name: "events",
  initialState: eventsAdapter.getInitialState({
    loading: false,
    error: null as string | null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        eventsAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

const eventsSelectorsGlobalized = {
  ...eventsAdapter.getSelectors((state: RootState) => state.entities.events),
  selectEventById: (state: RootState, { id }: { id: number }) => eventsSelectorsGlobalized.selectById(state, id),
};

export const { selectIds: selectEventIds, selectEntities: selectEventsEntities, selectAll: selectAllEvents, selectTotal: selectEventsTotal, selectEventById } = eventsSelectorsGlobalized;

export default eventsSlice.reducer;
