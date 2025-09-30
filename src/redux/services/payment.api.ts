import { fetch } from "../../libs/helper";

export const AddUpdatePaymentAPI = async (Amount: number | string): Promise<any> => {
    return fetch({
        url: `Payment/AddUpdatePayment?Amount=${Amount}`,
        method: "POST",
    });
};
export const CompleteOrderProcessAPI = async (payload: any): Promise<any> => {
    return fetch({
        url: `/Payment/CompleteOrderProcess`,
        method: "POST",
        data: payload
    });
};

export const getWalletHistory = async (payload: any): Promise<any> => {
    return fetch({
        url: `/Wallet/GetWalletHistory`,
        method: "POST",
        data: payload
    });
};