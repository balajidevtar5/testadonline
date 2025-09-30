import { createSlice } from "@reduxjs/toolkit";
import { deepClone } from "../../libs/helper";
import { GetChatById } from "../services/chat.api";

export interface chatDetailsState {
    data?: any;
    error?: string | null;
    isLoading?: boolean;
}

interface chatDetailPayload {
    chatId: number;
    pageNo: number;
}
const chatDetailsInitialState: chatDetailsState = {
    data: { data: [] },
    error: null,
    isLoading: false,
};

export interface chatDetailsDataResponse {
    data: any;
    success: boolean;
    message: string;
};
export const chatDetailsSlice = createSlice({
    name: "chatDetailsSlice",
    initialState: deepClone(chatDetailsInitialState),
    reducers: ({
        chatDetailsStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        chatDetailsSuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload,
                    error: null,
                    isLoading: false,
                }
            };
        },
        chatDetailsAppendMessage: (state, action) => {
            const currentData = Array.isArray(state.data?.data) ? state.data.data : [];
            state.data.data = [...currentData, action.payload];
        },
        chatDetailsFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false }
            }
        },
        chatDetailsReset: () => {
            return deepClone(chatDetailsInitialState);
        }
    })
});
export const { chatDetailsStarted, chatDetailsSuccess, chatDetailsFail, chatDetailsReset, chatDetailsAppendMessage  } = chatDetailsSlice.actions;

export const fetchChatDetailData = (payload: chatDetailPayload) => async (dispatch: any) => {
    dispatch(chatDetailsStarted());
    try {
        const res: chatDetailsDataResponse = await GetChatById(payload);
        if (res) {
            dispatch(chatDetailsSuccess(res));
        }
    } catch (e: any) {
        dispatch(chatDetailsFail(e.message));
    }
};