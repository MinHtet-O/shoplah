import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { OfferSubmission, Offer } from "../types";
import toast from "react-hot-toast";

interface OfferState {
  offers: Offer[];
  loading: boolean;
  error: string | null;
}

const initialState: OfferState = {
  offers: [],
  loading: false,
  error: null,
};

export const makeOffer = createAsyncThunk(
  "offers/makeOffer",
  async (
    { item_id, price }: OfferSubmission,
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    try {
      const response = await axios.post(
        "http://localhost:8080/offers",
        { item_id, price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Offer made successfully!");
      return response.data;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        return rejectWithValue("Internal server error");
      } else {
        toast.error("Failed to make offer");
        return rejectWithValue("Failed to make offer");
      }
    }
  }
);

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makeOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers.push(action.payload);
      })
      .addCase(makeOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default offersSlice.reducer;
