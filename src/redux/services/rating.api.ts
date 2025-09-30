import { fetch } from "../../libs/helper";

export interface AddRatingPayload {
    Rating: number;
    PostId: number;
    Device: "Android" | "iOS" | "Desktop";
    LanguageId: number;
    Feedback?: string;
}

export const addUserRatingAPI = async (payload: AddRatingPayload): Promise<any> => {
    return await fetch({
        url: "/User/AddRating",
        method: "POST",
        data: payload,
    });
};