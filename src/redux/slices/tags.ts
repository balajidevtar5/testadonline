import { createSlice } from "@reduxjs/toolkit";
import {  getTagsAPI } from "../services/common.api";
import { deepClone } from "../../libs/helper";
 
export interface tagsDataState {
    data?: any;
    error?: string | null;
    isLoading?: boolean;
}
const tagsDataInitialState: tagsDataState = {
    data: {},
    error: null,
    isLoading: false,
};
export interface tagsDataDataResponse {
    data: any;
    success: boolean;
    message: string;
};
export const tagsDataSlice = createSlice({
    name: "tagsDataSlice",
    initialState: deepClone(tagsDataInitialState),
    reducers: ({
        tagsDataStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        tagsDataSuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload,
                    error: null,
                    isLoading: false,
                }
            };
        },
        tagsDataFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false }
            }
        },
        tagsDataReset: () => {
            return deepClone(tagsDataInitialState);
        }
    })
});
export const { tagsDataStarted, tagsDataSuccess, tagsDataFail, tagsDataReset } = tagsDataSlice.actions;
 
export const fetchTagsData = () => async (dispatch: any) => {
    dispatch(tagsDataStarted());
    try {
        const res: tagsDataDataResponse = await getTagsAPI();
        if (res) {
            dispatch(tagsDataSuccess(res));
        }
    } catch (e: any) {
        dispatch(tagsDataFail(e.message));
    }
};