import { createSlice } from "@reduxjs/toolkit";
import { deepClone } from "../../libs/helper";
import { getCategory } from "../services/post.api";
import { getData, storeData } from "../../utils/localstorage";

export interface categoryDataState {
    data?: any;
    error?: string | null;
    isLoading?: boolean;
}
const categoryDataInitialState: categoryDataState = {
    data: {},
    error: null,
    isLoading: false,
};
export interface categoryDataDataResponse {
    data: any;
    success: boolean;
    message: string;
};
export const categoryDataSlice = createSlice({
    name: "categoryDataSlice",
    initialState: deepClone(categoryDataInitialState),
    reducers: ({
        categoryDataStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        categoryDataSuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload,
                    error: null,
                    isLoading: false,
                }
            };
        },
        categoryDataFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false }
            }
        },
        categoryDataReset: () => {
            return deepClone(categoryDataInitialState);
        }
    })
});
export const { categoryDataStarted, categoryDataSuccess, categoryDataFail, categoryDataReset } = categoryDataSlice.actions;

export const fetchCategoryData = (payload: { LanguageId: number }) => async (dispatch: any) => {
    dispatch(categoryDataStarted());
    try {
        // Try to get data from localStorage first
        const cachedData = await getData(`categoryData_${payload.LanguageId}`);
        
        if (cachedData) {
            // If cached data exists, use it
            dispatch(categoryDataSuccess(cachedData));
            return;
        }

        // If no cached data, make API call
        const res: categoryDataDataResponse = await getCategory(payload);
        if (res) {
            // Store the response in localStorage before dispatching
            await storeData(`categoryData_${payload.LanguageId}`, res);
            dispatch(categoryDataSuccess(res));
        }
    } catch (e: any) {
        dispatch(categoryDataFail(e.message));
    }
};

export const clearCategoryCache = async (languageId: number) => {
    await storeData(`categoryData_${languageId}`, null);
};