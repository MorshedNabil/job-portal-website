import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

const saved = localStorage.getItem("user");
const initialUser = saved ? JSON.parse(saved) : null;

function drfError(data, fallback) {
  if (!data) return fallback;
  if (data.detail) return data.detail;
  if (data.message) return data.message;
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    return Array.isArray(val) ? val[0] : String(val);
  }
  return fallback;
}

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login/", { identifier, password });
      return data;
    } catch (err) {
      return rejectWithValue(drfError(err.response?.data, "Login failed"));
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ name, email, phone, password, role }, { rejectWithValue }) => {
    try {
      await api.post("/auth/register/", { name, email, phone, password, role });
      return true;
    } catch (err) {
      return rejectWithValue(drfError(err.response?.data, "Registration failed"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    loading: false,
    error: "",
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.error = "";
      localStorage.removeItem("user");
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
