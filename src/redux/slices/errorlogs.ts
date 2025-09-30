import { createSlice } from "@reduxjs/toolkit";
import { deepClone } from "../../libs/helper";
import { getErrorLogAPI } from "../services/user.api";
 
export interface ErrorLogs {
    data?: any;
    error?: string | null;
    isLoading?: boolean;
}
const errorLogInitialState: ErrorLogs = {
    data: {},
    error: null,
    isLoading: false,
};
export interface ErrorLogDataResponse {
    data: any;
    success: boolean;
    message: string;
};
export const errorLogSlice = createSlice({
    name: "errorLogSlice",
    initialState: deepClone(errorLogInitialState),
    reducers: ({
        errorLogListStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        errorLogListSuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload,
                    error: null,
                    isLoading: false,
                }
            };
        },
        errorLogListFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false }
            }
        },
        errorLogListReset: () => {
            return deepClone(errorLogInitialState);
        }
    })
});
export const { errorLogListStarted, errorLogListSuccess, errorLogListFail, errorLogListReset } = errorLogSlice.actions;
 
export const fetchErrorLog = (payload) => async (dispatch: any) => {
    dispatch(errorLogListStarted());
    try {
        const res: ErrorLogDataResponse = await getErrorLogAPI(payload);
        if (res) {
            dispatch(errorLogListSuccess(res));
        }
    } catch (e: any) {
        dispatch(errorLogListFail(e.message));
    }
};