import { createSlice } from "@reduxjs/toolkit";
import { loginAPI } from "../services/auth.api";
import { deepClone } from "../../libs/helper";
import { getLoginUserAPI } from "../services/user.api";
import { toast } from "react-toastify";
import { message } from "antd";
import { LOGEVENTCALL, logEvents, LoginMethod } from "../../libs/constant";
import { getData, removeItem, storeData } from "../../utils/localstorage";
import { logEffect } from "../../utils/logger";
// import { logEvent } from "firebase/analytics";

export interface LoginPayload {
    MobileNo: string;
    IsMobile: boolean,
    ISWhatsapp: boolean,
    // demoToOriginal: boolean,
    LanguageId?: any,
    DesignId?: any,
    CityId?: any,
    installId?: any,
    // DeviceId?: any
}
export interface LoginState {
    data?: LoginDataResponse | any;
    error?: string | null;
    isLoading?: boolean;
}
export interface LoginUserState {
    data: LoginUserDataResponse | any;
    isLogin?: boolean;
    error?: string | null;
    isLoading?: boolean;
}
export interface LoginDataResponse {
    data?: Array<LoginUserDataResponse>;
    success?: boolean;
    message?: string;
}
export interface LoginUserDataResponse {
    firstname: string;
    flag?: string;
    lastname?: string;
    mobileno?: string;
    otp?: string;
    role?: string;
    preferreddesignid?: number;
    preferredlanguageid?: number;
    id?: string;
    success?: number;
    locationid?:string,
    secretkey?: string;
}
export interface LoginUserSuccessResponse {
    data?: LoginUserDataResponse | any;
    isLogin?: boolean;
    error?: string | null;
    isLoading?: boolean;
    success?: boolean;
    message?: string;
}
const loginInitialState: LoginState = {
    data: {},
    error: null,
    isLoading: false,
};

const loginUserInitialState: LoginUserState = {
    data: {},
    error: null,
    isLogin: false,
    isLoading: false,
};

export const loginSlice = createSlice({
    name: "login",
    initialState: deepClone(loginInitialState),
    reducers: {
        loginStarted: (state) => {
            return {
                ...state,
                isLoading: true,
            };
        },
        loginSuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload,
                    error: null,
                    isLoading: false,
                },
            };
        },
        loginFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false },
            };
        },
        loginReset: () => {
            return deepClone(loginInitialState);
        },
    },
});

export const loginUserSlice = createSlice({
    name: "loginUser",
    initialState: deepClone(loginUserInitialState),
    reducers: {
        loginUserStarted: (state) => {
            return {
                ...state,
                isLoading: true,
            };
        },
        loginUserSuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload,
                    error: null,
                    isLoading: false,
                    isLogin: true,
                },
            };
        },
        loginUserUpdate: (state, action) => {
            return {
                ...state,
                ...{
                    data: {
                        ...state.data,
                        ...action.payload,
                    },
                    error: null,
                    isLoading: false,
                    isLogin: true,
                },
            };
        },
        loginUserWorkspaceUpdate: (state, action) => {
            return {
                ...state,
                ...{
                    data: { ...state.data, workspace: action.payload },
                    error: null,
                    isLoading: false,
                    isLogin: true,
                },
            };
        },
        loginUserFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false },
            };
        },
        loginUserReset: () => {
            return deepClone(loginUserInitialState);
        },
    },
});

export const { loginSuccess, loginStarted, loginFail, loginReset } =
    loginSlice.actions;

export const {
    loginUserSuccess,
    loginUserStarted,
    loginUserUpdate,
    loginUserWorkspaceUpdate,
    loginUserFail,
    loginUserReset,
} = loginUserSlice.actions;

export const doLogin = (data: LoginPayload, mode: string) => async (dispatch: any) => {
    console.log("📢[auth.ts:176]: data: ", data);
    dispatch(loginStarted());
    try {
        const response: LoginDataResponse = await loginAPI(data);
        if (response.success) {
            
            dispatch(loginSuccess(response));
            if (mode === LoginMethod.userLogin) {
                message.success(response?.message, 5)
            }
            else if (mode === LoginMethod.userVisit) {
                const payload = {
                    id: response?.data[0]?.id,
                    role: response?.data[0]?.role,
                    locationId:response?.data[0]?.locationid,
                }
                const visiteduserData = await getData("visitedUser")

                if(!visiteduserData){
                    if(LOGEVENTCALL){
                    logEffect(logEvents.Visited_User)
                    }
                }
                await storeData("visitedUser", JSON.stringify(payload));
               
            }
        } else {
            dispatch(loginFail(response?.message));
        }
    } catch (e: any) {
        dispatch(loginFail(e.message));
        // message.error(e?.message)
    }
};

export const fetchLoginUser =
    ({ Authorization }: { Authorization: any }) => async (dispatch: any) => {
        dispatch(loginUserStarted());
        try {
            const res: LoginUserSuccessResponse = await getLoginUserAPI({ Authorization });
            if (res) {
                const visitedUser = await getData("visitedUser");
                const parseUserData = visitedUser
                if(res.data[0]?.id === parseUserData?.id){
                    await removeItem("visitedUser");
                }
                dispatch(loginUserSuccess(res));
            }
        } catch (e: any) {
            dispatch(loginUserFail(e.message));
        }
    };
