import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchJobsThunk = createAsyncThunk(
  "jobs/fetchJobs",
  async ({ q = "", location = "", page = 1, limit = 12 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/jobs/", {
        params: { q, location, page, limit },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load jobs");
    }
  }
);

export const fetchJobByIdThunk = createAsyncThunk(
  "jobs/fetchJobById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/jobs/${id}/`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load job");
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 12,
    loading: false,
    error: "",
    single: null,
    singleLoading: false,
    singleError: "",
  },
  reducers: {
    resetSingle(state) {
      state.single = null;
      state.singleError = "";
      state.singleLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobsThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchJobsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 12;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchJobsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load jobs";
        state.items = [];
        state.total = 0;
        state.totalPages = 1;
      })
      .addCase(fetchJobByIdThunk.pending, (state) => {
        state.singleLoading = true;
        state.singleError = "";
      })
      .addCase(fetchJobByIdThunk.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.single = action.payload;
      })
      .addCase(fetchJobByIdThunk.rejected, (state, action) => {
        state.singleLoading = false;
        state.singleError = action.payload || "Failed to load job";
        state.single = null;
      });
  },
});

export const { resetSingle } = jobsSlice.actions;
export default jobsSlice.reducer;
