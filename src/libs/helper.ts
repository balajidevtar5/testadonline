import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_ENDPOINT, API_ENDPOINT_PROFILE } from "./constant";

let axiosInstance: AxiosInstance | null = null;

export const API = (force = false): AxiosInstance => {
    if (axiosInstance && !force) {
        return axiosInstance;
    }
    axiosInstance = axios.create({
        baseURL: API_ENDPOINT,
    });
    return axiosInstance;
};



export const fetch: (config: AxiosRequestConfig) => Promise<any> = async (config) => {
    try {
        const response = await API()?.request(config);
        return response?.data;
    } catch (e: any) {
        if (
            e?.error?.response &&
            e?.error?.response?.data &&
            e?.error?.response?.data?.message
        ) {
            throw new Error(
                e.error.response.data.message || "Opps, an error occurred. Please try after sometime.",
            );
        } else if (e.response && e.response.data && e.response.data?.message) {
            throw new Error(e.response.data?.message);
        }
    }
}


export const deepClone = (obj: any) => {
    return JSON?.parse(JSON.stringify(obj));
}

export const onClickOfBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
export const onClickOfBackToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
};

export const changeDateFormat = (date: any) => {
    return new Date(date).toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }
    );
};
export const timeFormat = (date: any) => {
    return new Date(date).toLocaleTimeString(
        undefined,
        {

            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }
    );
};