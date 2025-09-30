import { fetch } from "../../libs/helper";

export const DeleteChat = async (payload): Promise<any> => {
    return fetch({
        url: `/Chat/DeleteChat?ChatId=${payload?.chatId}`,
        method: "POST",
    });
};
export const GetChatById = async (payload): Promise<any> => {
    return fetch({
        url: `/Chat/GetChatById?ChatId=${payload?.chatId}&pageNo=${payload.pageNo}`,
        method: "GET",
    });
};

export const GetMessageCount = async (): Promise<any> => {
    return fetch({
        url: `/Chat/GetMessageCount`,
        method: "GET",
    });
};



export const GetChatList = async (): Promise<any> => {
    return fetch({
        url: `/Chat/GetChatList`,
        method: "GET",
    });
};
export const SaveChat = async (payload): Promise<any> => {
    return fetch({
        url: `/Chat/SaveChat`,
        method: "POST",
        data: payload
    });
};


export const BlockUnblockUser = async (payload): Promise<any> => {
    return fetch({
        url: `/Chat/BlockUnblockUser?UserId=${payload?.userId}`,
        method: "GET",
    });
};
export const ReportUser = async (payload): Promise<any> => {
    return fetch({
        url: `/Chat/ReportUser`,
        method: "POST",
        data: payload
    });
};

export const IsSeenMessage = async (payload): Promise<any> => {
    return fetch({
        url: `/Chat/IsSeen?ChatId=${payload.ChatId}`,
        method: "GET",
    });
};
