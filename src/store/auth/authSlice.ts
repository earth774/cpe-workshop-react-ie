import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";

interface AuthState {
  currentUser: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  status: "idle",
  error: null,
};

const loadUserFromStorage = (): User | null => {
  const userString = localStorage.getItem("user");
  if (userString) {
    return JSON.parse(userString);
  }
  return null;
};

const preloadedState: AuthState = {
  currentUser: loadUserFromStorage(),
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    if (email === "demo@example.com" && password === "password") {
      const user: User = {
        id: "1",
        name: "Demo User",
        email: "demo@example.com",
      };

      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } else {
      return rejectWithValue("Email หรือรหัสผ่านไม่ถูกต้อง");
    }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

export const register = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    if (email === "demo@example.com") {
      return rejectWithValue("Email นี้ถูกใช้ไปแล้ว");
    }

    const user: User = {
      id: Date.now().toString(),
      name,
      email,
    };

    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: preloadedState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
      });
  },
});

export default authSlice.reducer;
