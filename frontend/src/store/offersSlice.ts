import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { OfferSubmission, Offer } from "./types";

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
  async ({ item_id, price }: OfferSubmission, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const response = await axios.post(
      "http://localhost:8080/offers",
      { item_id, price },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
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
        state.error = action.error.message || "Failed to make offer";
      });
  },
});

export default offersSlice.reducer;
