import { createSlice, ThunkAction } from "@reduxjs/toolkit";
import { getCitiesAPI } from "../services/common.api";
import { deepClone } from "../../libs/helper";
import { getLocations } from "../services/locations.api";
import { AppDispatch } from "../store";
import { RootState } from "../reducer";
 
export interface locationDataState {
    data?: any;
    error?: string | null;
    isLoading?: boolean;
}
const locationDataInitialState: locationDataState = {
    data: {},
    error: null,
    isLoading: false,
};
export interface locationDataDataResponse {
    data: any;
    success: boolean;
    message: string;
};
export const locationDataSlice = createSlice({
    name: "locationDataSlice",
    initialState: deepClone(locationDataInitialState),
    reducers: ({
        locationDataStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        locationDataSuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload.data,
                    error: null,
                    isLoading: false,
                }
            };
        },
        locationDataFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false }
            }
        },
        locationDataReset: () => {
            return deepClone(locationDataInitialState);
        },
        locationHistoryAppend: (state, action) => {
            if (!state.data) {
              state.data = { LocationHistoryResult: [] };
            }
          
            const { LocationHistoryResult } = state.data;
          
            // Initialize if not already an array
            if (!Array.isArray(LocationHistoryResult)) {
              state.data.LocationHistoryResult = [];
            }
          
            // Check if the entry already exists
            const duplicateIndex = LocationHistoryResult.findIndex(
              (entry) => entry.name === action.payload.name
            );
          
            if (duplicateIndex !== -1) {
              // If duplicate, remove it from the array
              LocationHistoryResult.splice(duplicateIndex, 1);
            }
          
            // Add the new entry to the top
            LocationHistoryResult.unshift(action.payload);
          
            // Keep only the latest 3 entries
            if (LocationHistoryResult.length > 3) {
              LocationHistoryResult.length = 3; // Truncate array to 3 items
            }
          },
          
          
    })
});
export const { locationDataStarted, locationDataSuccess, locationDataFail, locationDataReset,locationHistoryAppend } = locationDataSlice.actions;
 
export const fetchLocationData = (
  payload: { latitude: any; longitude: any; LanguageId: any }
): ThunkAction<Promise<locationDataDataResponse | undefined>, RootState, unknown, any> => 
  async (dispatch: AppDispatch) => {
    dispatch(locationDataStarted());
    try {
      const res = await getLocations(payload);
      if (res) {
        dispatch(locationDataSuccess(res)); // Dispatch success action
        return res; // Return the success response
      }
    } catch (e: any) {
      dispatch(locationDataFail(e.message)); // Dispatch failure action
      throw e; // Rethrow the error to be handled by the caller
    }
  };
