import { fetch } from "../../libs/helper";

export const getAllStatistics = async (startDate: string, endDate: string): Promise<any> => {
    try {
        return await fetch({
            url: `/Statistics/GetStatisticsReport`,
            method: "GET",
            params: {
                startDate,
                endDate
            }
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        throw error;
    }
}

export const getRegions = async (): Promise<any> => {
    try {
        return await fetch({
            url: `/Statistics/GetRegions`,  
            method: "GET",
        })
    } catch (error) {
        console.error("Error fetching regions:", error);
        throw error;
    }
}

export const getActivityType = async (): Promise<any> => {
    try {
       return await fetch ({
        url: `/Statistics/GetActivityTypes`,
        method: "GET",
       })     
    } catch (error) {
        console.error("Error fetching activity type:", error);
        throw error;
    }
}

export const getCityBasedStatistics = async (payload: any): Promise<any> => {
    try {
        return await fetch({
            url: `/Statistics/GetStatisticsCityBaseReport`,
            method: "POST",
            data: payload
        });
    } catch (error) {
        console.error("Error fetching city based statistics:", error);
        throw error;
    }
}

export const AddAppStatistics = async (payload:any): Promise<any> => {
    return fetch({
        url: `/User/AddAppInstalled?UserId=${payload.userId}&Platform=${payload.Platform}&LocationId=${payload.LocationId}`,
        method: "PUT",
    });
};

export const getCities = async (RegionId: any): Promise<any> => {    
    return fetch({
        url: `/Statistics/GetRegionCities?RegionId=${RegionId}`,
        method: "GET",
    });
}

export const GetDistricts = async (): Promise<any> => {    
    return fetch({
        url: `/Statistics/GetDistricts`,
        method: "GET",
    });
}