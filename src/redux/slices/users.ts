import { createSlice } from "@reduxjs/toolkit";
import { deepClone } from "../../libs/helper";
import { getUserListAPI } from "../services/user.api";
 
export interface userListState {
    data?: any;
    error?: string | null;
    isLoading?: boolean;
}
const userListInitialState: userListState = {
    data: {},
    error: null,
    isLoading: false,
};
export interface userListDataResponse {
    data: any;
    success: boolean;
    message: string;
};
export const userListSlice = createSlice({
    name: "userListSlice",
    initialState: deepClone(userListInitialState),
    reducers: ({
        userListStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        userListSuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload,
                    error: null,
                    isLoading: false,
                }
            };
        },
        userListFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false }
            }
        },
        userListReset: () => {
            return deepClone(userListInitialState);
        }
    })
});
export const { userListStarted, userListSuccess, userListFail, userListReset } = userListSlice.actions;
 
export const fetchUserList = (payload) => async (dispatch: any) => {
    dispatch(userListStarted());
    try {
        const res: userListDataResponse = await getUserListAPI(payload);
        if (res) {
            dispatch(userListSuccess(res));
        }
    } catch (e: any) {
        dispatch(userListFail(e.message));
    }
};