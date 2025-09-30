
import { fetch } from "../../libs/helper";

export const addPremiumAd = async (payload: any): Promise<any> => {
    return fetch({
        url: "/Ads/PremiumAdUpload",
        method: "POST",
        data:payload
    });
};

export const deletePremiumAdApi = async (id: any): Promise<any> => {
    return fetch({
        url: `/Ads/DeletePremiumAd?premiumAdId=${id}`,
        method: "PUT",
    });
};

export const AvailableAdsSlotApi = async (): Promise<any> => {
    return fetch({
        url: `/Ads/AvailableAdsSlot`,
        method: "GET",
    });
};