import { fetch } from "../../libs/helper";


export const getLocations = async (payload): Promise<any> => {
    return fetch({
        url: `/Location/getLocations?latitude=${payload.latitude}&longitude=${payload.longitude}&LanguageId=${payload.LanguageId}`,
        method: "GET",
    });
};

export const getLocationChild = async (payload): Promise<any> => {
    return fetch({
        url: `/Location/getLocationChild?ParentId=${payload.ParentId}&LanguageId=${payload.LanguageId}`,
        method: "GET",
    });
};


export const getLocationBySearch = async (payload): Promise<any> => {
    return fetch({
        url: `/Location/getLocationBySearch?SearchText=${payload.SearchText}`,
        method: "GET",
    });
};

export const SaveLocationHistory = async (payload): Promise<any> => {
      const queryParams = new URLSearchParams({
        LocationId: payload.LocationId,
    });

    if (payload.UnregisteredUserId) {
        queryParams.append("UnregisteredUserId", payload.UnregisteredUserId);
    }

    return fetch({
        url: `/Location/SaveLocationHistory?${queryParams.toString()}`,
        method: "GET",
    });
};

export const getLocationById = async (payload): Promise<any> => {
    return fetch({
        url: `/Location/getLocationById?LocationId=${payload.LocationId}&LanguageId=${payload.LanguageId}`,
        method: "GET",
    });
};

export const getNearestLocation = async (payload): Promise<any> => {
    return fetch({
        url: `/Location/getNearestLocation?latitude=${payload.latitude}&longitude=${payload.longitude}&LanguageId=${payload.LanguageId}`,
        method: "GET",
    });
};








