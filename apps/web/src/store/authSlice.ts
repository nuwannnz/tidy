import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@tidy/shared-types';

interface AuthState {
  user: { id: string; email: string } | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        return rejectWithValue('This email is already registered');
      }
      if (response.status === 400 && data.errors) {
        const messages = (data.errors as { message: string }[]).map((e) => e.message).join(', ');
        return rejectWithValue(messages);
      }
      return rejectWithValue('Registration failed. Please try again.');
    }

    return data as { user: User; token: string };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: { id: string; email: string }; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Registration failed';
      });
  },
});

export const { setAuth, clearError, logout } = authSlice.actions;
export default authSlice.reducer;
