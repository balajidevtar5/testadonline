import { fetch } from "../../libs/helper";
import {
    LoginDataResponse,
    LoginPayload
} from "../slices/auth";

export const loginAPI = async (
    payload: LoginPayload,
): Promise<LoginDataResponse> => {
    console.log("📢[auth.api.ts:9]: payload: ", payload);
    return fetch({
        url: `/Auth/Login`,
        method: "POST",
        params: payload
    });
};

export const VerificationOtpAPI = async (payload): Promise<any> => {
    return fetch({
        url: `/Auth/Verification`,
        method: "POST",
        data: payload
    });
};
export const resendOtpAPI = async (payload): Promise<any> => {
    return fetch({
        url: `/Auth/ResendOTP?MobileNo=${payload.MobileNo}&IsMobile=${payload.IsMobile}&ISWhatsapp=${payload.ISWhatsapp}&LanguageId=${payload.LanguageId}`,
        method: "PUT",
    });
};


export const SendWhatsappMessage = async (SearchHistoryId): Promise<any> => {
    return fetch({
        url: `/Auth/SendWhatsappMessage`,
        method: "POST",
    });
};

 