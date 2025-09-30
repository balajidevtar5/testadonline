
import { fetch } from "../../libs/helper";

export const getCitiesAPI = async (payload): Promise<any> => {
    return fetch({
        url: `/Post/GetCities?LanguageId=${payload.LanguageId}`,
        method: "GET",
    });
};

export const getTagsAPI = async (): Promise<any> => {
    return fetch({
        url: "/Post/GetTags",
        method: "GET",
    });
};
export const findCityFromCoordinatesAPI = async (lat, lng): Promise<any> => {
    return fetch({
        url: `/Post/FindCity?Latitude=${lat}&Longitude=${lng}`,
        method: "GET",
    });
};

export const fireBaseTokenStore = async (payload): Promise<any> => {
    return fetch({
        url: "/Notification/SaveFireBaseToken",
        method: "POST",
        data:payload
    });
};
export const GetDesignOptions = async (): Promise<any> => {
    return fetch({
        url: `/GetDesignOptions`,
        method: "GET",
    });
};

export const GetWhatsappTemplates = async (): Promise<any> => {
    return fetch({
        url: "/Notification/GetWhatsappTemplates",
        method: "GET",
    });
};

export const SendWhatsappMessage = async (payload): Promise<any> => {
    return fetch({
        url: `/Notification/SendWhatsappMessage`,
        method: "POST",
        data:payload
    });
};

