import { fetch } from "../../libs/helper";
import { getData } from "../../utils/localstorage";
import { LoginUserSuccessResponse } from "../slices/auth";

export const getLoginUserAPI = async ({
    Authorization,
}: any): Promise<LoginUserSuccessResponse> => {
    return fetch({
        url: `User/UserInfo?LanguageId=${await getData("i18nextLng") || 2}`,
        method: "GET",
        headers: { Authorization },
    });
};

export const updateProfileAPI = async (payload: any): Promise<any> => {
    return fetch({
        url: `/User/UpdateProfile?LanguageId=${await getData("i18nextLng") || 2}`,
        method: "POST",
        data: payload,
    });
};
export const deleteAccountAPI = async (): Promise<any> => {
    return fetch({
        url: `/User/DeleteUser`,
        method: "PUT",
    });
};
export const getUserListAPI = async (payload): Promise<any> => {
    return fetch({
        url: "/User/GetUserList",
        method: "POST",
        data: payload,
    });
};
export const getUserActivityLogsAPI = async (payload): Promise<any> => {
    return fetch({
        url: "/User/GetActivityLogs",
        method: "POST",
        data: payload,
    });
};


export const getErrorLogAPI = async (payload): Promise<any> => {
    return fetch({
        url: `/ErrorLogs/GetErrorLogs?PageNum=${payload.PageNumber}&PageSize=${payload.PageSize}&OrderColumnName=${payload.SortColumn}&OrderColumnDir=${payload.SortDirection}`,
        method: "GET",
    });
};

export const pushNotificationApi = async (formData: FormData): Promise<any> => {
    const modelData = formData.get("model") as string;
    formData.delete("model"); 

    return fetch({
        url: `/Notification/SendNotificationMessage?model=${encodeURIComponent(modelData)}`,
        method: "POST",
        data: formData, 
    });
};


export const UpdateDesignOption = async (designId): Promise<any> => {
    return fetch({
        url: `/User/UpdateDesignOption?DesignId=${designId}`,
        method: "GET",
    });
};

export const GetUserSearchHistory = async (): Promise<any> => {
    return fetch({
        url: `/User/GetUserSearchHistory`,
        method: "POST",
    });
};

export const DeleteUserSearchHistory = async (SearchHistoryId): Promise<any> => {
    return fetch({
        url: `/User/DeleteUserSearchHistory?SearchHistoryText=${SearchHistoryId}`,
        method: "POST",
    });
};

export const SendWhatsappMessage = async (SearchHistoryId): Promise<any> => {
    return fetch({
        url: `/User/DeleteUserSearchHistory?SearchHistoryId=${SearchHistoryId}`,
        method: "POST",
    });
};

export const TrackContactActivity = async (payload: any): Promise<any> => {
    return fetch({
        url: `/User/TrackContactActivity`,
        method: "POST",
        data: payload
    });
};

export const TrackActivity = async (payload: any): Promise<any> => {
    return fetch({
        url:`/User/TrackActivity`,
        method: "POST",
        data: payload
    })
}

export const UpdateTheme = async (payload: any): Promise<any> => {
    return fetch({
        url: `/User/UpdateTheme?IsDarkMode=${payload.IsDarkMode}`,
        method: "GET",
    });
};

export const UpdateLastSeen = async (): Promise<any> => {
    return fetch({
        url: `/User/UpdateLastSeen`,
        method: "GET",
    });
};

export const ReferralDetail  = async (CODE) : Promise<any> => {
    return fetch({
        url: `/User/AddReferralDetail?CODE=${CODE?.CODE}`,
        method: "PUT",
    })
}
export const GetRewardDetail = async (): Promise<any> => {
    return fetch({
        url: `/User/GetRewardDetail`,
        method: "GET",
    });
};


