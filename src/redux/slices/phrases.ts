import { createSlice } from "@reduxjs/toolkit";
import { deepClone } from "../../libs/helper";
import { getStaticPhrasesAPI, AddUpdateStaticPhrasessAPI } from "../services/staticphrases.api";

export interface PhrasesDataState {
    data?: any[];
    error?: string | null;
    isLoading?: boolean;
}

const phrasesDataInitialState: PhrasesDataState = {
    data: [],
    error: null,
    isLoading: false,
};

export interface PhrasesDataResponse {
    data: any;
    success: boolean;
    message: string;
}

export const phrasesDataSlice = createSlice({
    name: "phrasesDataSlice",
    initialState: deepClone(phrasesDataInitialState),
    reducers: {
        phrasesDataStarted: (state) => {
            return {
                ...state,
                isLoading: true,
            };
        },
        phrasesDataSuccess: (state, action) => {
            return {
                ...state,
                data: action.payload,
                error: null,
                isLoading: false,
            };
        },
        phrasesDataFail: (state, action) => {
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        },
        phrasesDataReset: () => {
            return deepClone(phrasesDataInitialState);
        },
    },
});

export const {
    phrasesDataStarted,
    phrasesDataSuccess,
    phrasesDataFail,
    phrasesDataReset,
} = phrasesDataSlice.actions;

export const fetchPhrasesData = () => async (dispatch: any) => {
    dispatch(phrasesDataStarted());
    try {
        const res: PhrasesDataResponse = await getStaticPhrasesAPI();
        if (res) {
            dispatch(phrasesDataSuccess(res));
        } else {
            throw new Error("Unexpected data format");
        }
    } catch (e: any) {
        dispatch(phrasesDataFail(e.message));
    }
};

export const updatePhrasesData = (payload: { StaticTexts: { Id: any; TextCode: any; LanguageId: any; Value: any; }[]; }) => async (dispatch: any) => {
    dispatch(phrasesDataStarted());
    try {
        const res: PhrasesDataResponse = await AddUpdateStaticPhrasessAPI(payload);
        if (res) {
            dispatch(phrasesDataSuccess(res));
            return res;
        }
    } catch (e: any) {
        dispatch(phrasesDataFail(e.message));
    }
};

export default phrasesDataSlice.reducer;