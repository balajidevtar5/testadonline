import { createSlice } from "@reduxjs/toolkit";
import { deepClone } from "../../libs/helper";
import { getCategory } from "../services/post.api";
import { getAllSettingsAPI, GetSettingsForFrontend } from "../services/setting.api";
 
export interface settingDataState {
    data?: any;
    error?: string | null;
    isLoading?: boolean;
}
const settingDataInitialState: settingDataState = {
    data: {},
    error: null,
    isLoading: false,
};
export interface settingDataResponse {
    data: any;
    success: boolean;
    message: string;
};
export const settingDataSlice = createSlice({
    name: "settingDataSlice",
    initialState: deepClone(settingDataInitialState),
    reducers: ({
        settingDataStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        settingDataSuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload,
                    error: null,
                    isLoading: false,
                }
            };
        },
        settingDataFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false }
            }
        },

        settingDataReset: () => {
            return deepClone(settingDataInitialState);
        }
    })
});
export const { settingDataStarted, settingDataSuccess, settingDataFail, settingDataReset } = settingDataSlice.actions;
 
export const fetchSettingData = () => async (dispatch: any) => {
    dispatch(settingDataStarted());
    try {
      const res: settingDataResponse = await GetSettingsForFrontend();
      if (res) {
        dispatch(settingDataSuccess(res));
      }
    } catch (e: any) {
      dispatch(settingDataFail(e.message));
    }
  };