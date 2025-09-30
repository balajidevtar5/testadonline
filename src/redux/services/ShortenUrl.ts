import { fetch } from "../../libs/helper";



export const GetRedirection = async (payload:any): Promise<any> => {
    return fetch({
        url: `/ShortenUrl/GetUrlList`,
        method: "POST",
        data:payload
    });
};


export const AddUpdateUrl = async (payload:any): Promise<any> => {
    return fetch({
        url: `/ShortenUrl/AddUpdateUrl`,
        method: "POST",
        data:payload
    });
};

export const DeleteUrl = async (payload:any): Promise<any> => {
    return fetch({
        url: `/ShortenUrl/DeleteUrl?id=${payload?.id}`,
        method: "DELETE",
    });
};


