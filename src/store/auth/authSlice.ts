import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types";
import * as api from "../../services/api";

interface AuthState {
  currentUser: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  profileStatus: "idle" | "loading" | "succeeded" | "failed";
}

const preloadedState: AuthState = {
  currentUser: null,
  status: "idle",
  error: null,
  profileStatus: "idle",
};

export const register = createAsyncThunk<
  { user: User; token: string },
  { name: string; email: string; password: string }
>("auth/register", async ({ name, email, password }) => {
  const response = await api.register(name, email, password);
  const user: User = {
    id: response.data.id,
    name: response.data.name,
    email: response.data.email,
    status_id: response.data.status_id,
    created_at: response.data.created_at,
    updated_at: response.data.updated_at,
  };
  return {
    user: user,
    token: response.data.email,
  };
});

const authSlice = createSlice({
  name: "auth",
  initialState: preloadedState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
      builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload.user;
        state.error = null;
      })
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
