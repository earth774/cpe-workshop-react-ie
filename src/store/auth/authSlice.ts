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

export const login = createAsyncThunk<
  { user: User; status: number },
  { email: string; password: string }
>("auth/login", async ({ email, password }, { dispatch }) => {
  const response = await api.login(email, password);
  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("refresh_token", response.data.refresh_token);

  dispatch(fetchUserProfile());

  return {
    user: response.user,
    status: response.status || 201,
  };
});

export const fetchUserProfile = createAsyncThunk<User, void>(
  "auth/fetchUserProfile",
  async () => {
    const response = await api.getProfile();
    return response.data;
  }
);

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

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await api.logout();
  } catch (error) {
    console.error("Logout error:", error);
  }
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: preloadedState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload.user;
        state.error = null;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileStatus = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload.user;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
        state.status = "idle";
        state.profileStatus = "idle";
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
