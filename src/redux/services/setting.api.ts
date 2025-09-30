import { fetch } from "../../libs/helper";

export const getAllSettingsAPI = async (): Promise<any> => {
    return fetch({
        url: "/Settings/GetAllSettings",
        method: "GET",
    });
};

export const GetSettingsForFrontend = async (): Promise<any> => {
    return fetch({
        url: "/Settings/GetSettingsForFrontend",
        method: "GET",
    });
};


export const AddUpdateSettingsAPI = async (payload): Promise<any> => {
    return fetch({
        url: "/Settings/AddUpdateSettings",
        method: "POST",
        data:payload
    });
};



export const getSettingsByNameAPI = async (settingName:string): Promise<any> => {
    return fetch({
        url: `/Settings/GetSettingsByName?settingName=${settingName}`,
        method: "GET",
    });
};

export const getOtpOption = async (): Promise<any> => {
    return fetch({
        url: `/Settings/GetOtpOption`,
        method: "GET",
    });
};

export const getAppVersionApi = async (): Promise<any> => {
    return fetch({
        url: `Auth/GetAppVersion`,
        method: "GET",
    });
};

export const getLanguageList = async (): Promise<any> => {
    return fetch({
        url: `Languages/GetLanguages`,
        method: "GET",
    });
};


export const updateLanguage = async (payload): Promise<any> => {
    const queryParams = new URLSearchParams({
        LanguageId: payload.LanguageId,
    });

    if (payload.UnregisteredUserId) {
        queryParams.append("UnregisteredUserId", payload.UnregisteredUserId);
    }

    return fetch({
        url: `User/UpdateLanguage?${queryParams.toString()}`,
        method: "GET",
    });
};


export const fireBaseTokeStore = async (payload): Promise<any> => {
    return fetch({
        url: `User/UpdateLanguage?LanguageId=${payload.LanguageId}`,
        method: "GET",
    });
};