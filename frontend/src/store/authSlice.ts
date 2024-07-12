import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { AppDispatch } from "./store";

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
  userName: string;
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
  userName: string | null;
  initializing: boolean; // New state for initialization
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  userId: null,
  userName: null,
  initializing: true, // Initializing state starts as true
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
      localStorage.removeItem("token");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setAuthFromToken: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.initializing = false; // Set initializing to false when done
      try {
        const decodedToken = jwtDecode<DecodedToken>(action.payload.token);
        console.log({ decodedToken });
        state.userId = decodedToken.userId;
        state.userName = decodedToken.userName;
      } catch (error) {
        state.error = {
          status: "error",
          statusCode: 500,
          message: "Failed to decode token",
        };
      }
    },
    finishInitializing: (state) => {
      state.initializing = false; // Action to finish initializing
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
          localStorage.setItem("token", action.payload.token);
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

export const { logout, clearAuthError, setAuthFromToken, finishInitializing } =
  authSlice.actions;
export default authSlice.reducer;

// Initialize auth state from localStorage token
export const initializeAuth = () => (dispatch: AppDispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    dispatch(setAuthFromToken({ token }));
  } else {
    dispatch(finishInitializing()); // Finish initializing if no token
  }
};
