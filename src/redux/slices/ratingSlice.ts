import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addUserRatingAPI, AddRatingPayload } from "../services/rating.api";
import { deepClone } from "../../libs/helper"; 

export const submitUserRating = createAsyncThunk(
    "rating/submitUserRating",
    async (payload: AddRatingPayload, thunkAPI) => {
        try {
            const response = await addUserRatingAPI(payload);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Failed to submit rating");
        }
    }
);

export interface RatingState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const ratingInitialState: RatingState = {
    loading: false,
    error: null,
    success: false,
};

const ratingSlice = createSlice({
    name: "rating",
    initialState: deepClone(ratingInitialState),
    reducers: {
        ratingReset: () => deepClone(ratingInitialState),
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitUserRating.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitUserRating.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(submitUserRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { ratingReset } = ratingSlice.actions;
export default ratingSlice.reducer;