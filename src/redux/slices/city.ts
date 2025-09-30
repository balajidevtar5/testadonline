import { createSlice } from "@reduxjs/toolkit";
import { getCitiesAPI } from "../services/common.api";
import { deepClone } from "../../libs/helper";
 
export interface cityDataState {
    data?: any;
    error?: string | null;
    isLoading?: boolean;
}
const cityDataInitialState: cityDataState = {
    data: {},
    error: null,
    isLoading: false,
};
export interface cityDataDataResponse {
    data: any;
    success: boolean;
    message: string;
};
export const cityDataSlice = createSlice({
    name: "cityDataSlice",
    initialState: deepClone(cityDataInitialState),
    reducers: ({
        cityDataStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        cityDataSuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload.data.map((elm: any) => ({ label: elm.name, value: elm.id })),
                    error: null,
                    isLoading: false,
                }
            };
        },
        cityDataFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false }
            }
        },
        cityDataReset: () => {
            return deepClone(cityDataInitialState);
        }
    })
});
export const { cityDataStarted, cityDataSuccess, cityDataFail, cityDataReset } = cityDataSlice.actions;
 
export const fetchCityData = (payload: { LanguageId: number }) => async (dispatch: any) => {
    dispatch(cityDataStarted());
    try {
      const res: cityDataDataResponse = await getCitiesAPI(payload);
      if (res) {
        dispatch(cityDataSuccess(res));
      }
    } catch (e: any) {
      dispatch(cityDataFail(e.message));
    }
  };