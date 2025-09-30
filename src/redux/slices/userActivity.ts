import { createSlice } from "@reduxjs/toolkit";
import { deepClone } from "../../libs/helper";
import { getUserActivityLogsAPI } from "../services/user.api";
 
export interface userActivityState {
    data?: any;
    error?: string | null;
    isLoading?: boolean;
}
const userActivityInitialState: userActivityState = {
    data: {},
    error: null,
    isLoading: false,
};
export interface userActivityDataResponse {
    data: any;
    success: boolean;
    message: string;
};
export const userActivitySlice = createSlice({
    name: "userActivitySlice",
    initialState: deepClone(userActivityInitialState),
    reducers: ({
        userActivityStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        userActivitySuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload,
                    error: null,
                    isLoading: false,
                }
            };
        },
        userActivityFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false }
            }
        },
        userActivityReset: () => {
            return deepClone(userActivityInitialState);
        }
    })
});
export const { userActivityStarted, userActivitySuccess, userActivityFail, userActivityReset } = userActivitySlice.actions;
 
export const fetchUserActivityLogs = (payload) => async (dispatch: any) => {
    dispatch(userActivityStarted());
    try {
        const res: userActivityDataResponse = await getUserActivityLogsAPI(payload);
        if (res) {
            dispatch(userActivitySuccess(res));
        }
    } catch (e: any) {
        dispatch(userActivityFail(e.message));
    }
};