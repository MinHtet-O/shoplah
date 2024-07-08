import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface AuthResponse {
  token: string;
}

interface ErrorResponse {
  status: string;
  statusCode: number;
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

interface DecodedToken extends JwtPayload {
  userId: number;
  // add other fields if present in your token
}

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: ErrorResponse }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(
      "http://localhost:8080/auth/login",
      credentials
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response?.data) {
      return rejectWithValue(axiosError.response.data);
    }
    return rejectWithValue({
      status: "error",
      statusCode: 500,
      message: "An unexpected error occurred",
    });
  }
});

export const register = createAsyncThunk<
  void,
  { username: string; email: string; password: string },
  { rejectValue: ErrorResponse }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    await axios.post("http://localhost:8080/auth/register", userData);
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response?.data) {
      return rejectWithValue(axiosError.response.data);
    }
    return rejectWithValue({
      status: "error",
      statusCode: 500,
      message: "An unexpected error occurred",
    });
  }
});

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ErrorResponse | null;
  userId: number | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.userId = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.error = null;

        try {
          const decodedToken = jwtDecode<DecodedToken>(action.payload.token);
          state.userId = decodedToken.userId;
        } catch (error) {
          state.error = {
            status: "error",
            statusCode: 500,
            message: "Failed to decode token",
          };
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {
          status: "error",
          statusCode: 500,
          message: "An unexpected error occurred",
        };
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {
          status: "error",
          statusCode: 500,
          message: "An unexpected error occurred",
        };
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
