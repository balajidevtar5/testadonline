import { createSlice } from "@reduxjs/toolkit";
import { deepClone } from "../../libs/helper";
import { getAllStatistics, getRegions, getActivityType, getCityBasedStatistics, getCities, GetDistricts } from "../services/Statistics.api";

export interface statisticsDataState {
    data?: any;
    error?: string | null;
    isLoading?: boolean;
}

const statisticsDataInitialState: statisticsDataState = {
    data: {},
    error: null,
    isLoading: false,
};

const cityBasedDataInitialState: statisticsDataState = {
    data: {},
    error: null,
    isLoading: false,
};

const citiesInitialState: statisticsDataState = {
    data: [],
    error: null,
    isLoading: false,
};

export interface statisticsDataResponse {
    data: any;
    success: boolean;
    message: string;
};

export interface RegionsState {
    data: any[];
    error: string | null;
    isLoading: boolean;
}

export interface ActivityTypesState {
    data: any[];
    error: string | null;
    isLoading: boolean;
}

export interface CitiesState {
    data: any[];
    error: string | null;
    isLoading: boolean;
}

const regionsInitialState: RegionsState = {
    data: [],
    error: null,
    isLoading: false,
};

const activityTypesInitialState: ActivityTypesState = {
    data: [],
    error: null,
    isLoading: false,
};

export const statisticsDataSlice = createSlice({
    name: "statisticsDataSlice",
    initialState: deepClone(statisticsDataInitialState),
    reducers: ({
        statisticsDataStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        statisticsDataSuccess: (state, action) => {
            return {
                ...state,
                ...{
                    data: action.payload,
                    error: null,
                    isLoading: false,
                }
            };
        },
        statisticsDataFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false }
            }
        }, 

        statisticsDataReset: () => {
            return deepClone(statisticsDataInitialState);
        }
    })
});
export const { statisticsDataStarted, statisticsDataSuccess, statisticsDataFail, statisticsDataReset } = statisticsDataSlice.actions;

export const cityBasedDataSlice = createSlice({
    name: "cityBasedDataSlice",
    initialState: deepClone(cityBasedDataInitialState),
    reducers: ({
        cityBasedDataStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        cityBasedDataSuccess: (state, action) => {
            return {
                ...state,
                ...{ data: action.payload, error: null, isLoading: false }
            }
        },
        cityBasedDataFail: (state, action) => {
            return {
                ...state,
                ...{ error: action.payload, isLoading: false }
            }
        },
        cityBasedDataReset: () => {
            return deepClone(cityBasedDataInitialState);
            }
        
    })
});
export const { cityBasedDataStarted, cityBasedDataSuccess, cityBasedDataFail, cityBasedDataReset } = cityBasedDataSlice.actions;

export const regionsSlice = createSlice({
    name: "regions",
    initialState: deepClone(regionsInitialState),
    reducers: {
        regionsStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        regionsSuccess: (state, action) => {
            return {
                ...state,
                data: action.payload,
                error: null,
                isLoading: false,
            }
        },
        regionsFail: (state, action) => {
            return {
                ...state,
                error: action.payload,
                isLoading: false
            }
        },
        regionsReset: () => {
            return deepClone(regionsInitialState);
        }
    }
});

export const activityTypesSlice = createSlice({
    name: "activityTypes",
    initialState: deepClone(activityTypesInitialState),
    reducers: {
        activityTypesStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        activityTypesSuccess: (state, action) => {
            return {
                ...state,
                data: action.payload,
                error: null,
                isLoading: false,
            }
        },
        activityTypesFail: (state, action) => {
            return {
                ...state,
                error: action.payload,
                isLoading: false
            }
        },
        activityTypesReset: () => {
            return deepClone(activityTypesInitialState);
        }
    }
});

export const { regionsStarted, regionsSuccess, regionsFail, regionsReset } = regionsSlice.actions;
export const { activityTypesStarted, activityTypesSuccess, activityTypesFail, activityTypesReset } = activityTypesSlice.actions;

export const citiesSlice = createSlice({
    name: "cities",
    initialState: deepClone(citiesInitialState),
    reducers: {
        citiesStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        citiesSuccess: (state, action) => {
            return {    
                ...state,
                data: action.payload,
                error: null,
                isLoading: false,
            }
        },
        citiesFail: (state, action) => {        
            return {
                ...state,
                error: action.payload,
                isLoading: false
            }
        },
        citiesReset: () => {
            return deepClone(citiesInitialState);
        }
    }
});


export const districtsSlice = createSlice({
    name: "cities",
    initialState: deepClone(citiesInitialState),
    reducers: {
        districtsStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        districtsSuccess: (state, action) => {
            return {    
                ...state,
                data: action.payload,
                error: null,
                isLoading: false,
            }
        },
        districtsFail: (state, action) => {        
            return {
                ...state,
                error: action.payload,
                isLoading: false
            }
        },
        districtsReset: () => {
            return deepClone(citiesInitialState);
        }
    }
});

export const { citiesStarted, citiesSuccess, citiesFail, citiesReset } = citiesSlice.actions;
export const { districtsStarted, districtsSuccess, districtsFail, districtsReset } = districtsSlice.actions;


export const fetchstatisticsData =
  (startDate: string, endDate: string) =>
  async (dispatch: any) => {
    dispatch(statisticsDataStarted());
    try {
      const res: statisticsDataResponse = await getAllStatistics(startDate, endDate);
      if (res?.success && res.data) {
        dispatch(statisticsDataSuccess(res.data));
        return res.data; 
      } else {
        dispatch(statisticsDataFail(res.message || "Failed to fetch statistics data"));
        throw new Error(res.message || "Failed to fetch statistics data");
      }
    } catch (e: any) {
      dispatch(statisticsDataFail(e.message || "Failed to fetch statistics data."));
      throw e;
    }
  };

export const fetchRegions = () => async (dispatch: any) => {
    dispatch(regionsStarted());
    try {
        const res = await getRegions();
        if (res?.success && res.data) {
            dispatch(regionsSuccess(res.data));
            return res.data;
        } else {
            dispatch(regionsFail(res.message || "Failed to fetch regions"));
            throw new Error(res.message || "Failed to fetch regions");
        }
    } catch (e: any) {
        dispatch(regionsFail(e.message || "Failed to fetch regions"));
        throw e;
    }
};

export const fetchCities = (regionId: number) => async (dispatch: any) => {
    dispatch(citiesStarted());
    try {
        const res = await getCities(regionId);
        if (res?.success && res.data) {
            dispatch(citiesSuccess(res.data));
            return res.data;
        } else {
            dispatch(citiesFail(res.message || "Failed to fetch cities"));
            throw new Error(res.message || "Failed to fetch cities");
        }
    } catch (e: any) {
        dispatch(citiesFail(e.message || "Failed to fetch cities"));
        throw e;
    }
}

export const fetchActivityTypes = () => async (dispatch: any) => {
    dispatch(activityTypesStarted());
    try {
        const res = await getActivityType();
        if (res?.success && res.data) {
            dispatch(activityTypesSuccess(res.data));
            return res.data;
        } else {
            dispatch(activityTypesFail(res.message || "Failed to fetch activity types"));
            throw new Error(res.message || "Failed to fetch activity types");
        }
    } catch (e: any) {
        dispatch(activityTypesFail(e.message || "Failed to fetch activity types"));
        throw e;
    }
};

export const fetchDistrict = () => async (dispatch: any) => {
    dispatch(districtsStarted());
    try {
        const res = await GetDistricts();
        if (res?.success && res.data) {
            dispatch(districtsSuccess(res.data));
            return res.data;
        } else {
            dispatch(districtsFail(res.message || "Failed to fetch cities"));
            throw new Error(res.message || "Failed to fetch cities");
        }
    } catch (e: any) {
        dispatch(districtsFail(e.message || "Failed to fetch cities"));
        throw e;
    }
}
export const fetchCityBasedStatistics = (payload: any) => async (dispatch: any) => {
    dispatch(cityBasedDataStarted());
    try {
        const res = await getCityBasedStatistics(payload);
        if (res.data) {
            dispatch(cityBasedDataSuccess(res.data));
            return res.data;
        } else {
            dispatch(cityBasedDataFail(res.message || "Failed to fetch city based statistics"));
            throw new Error(res.message || "Failed to fetch city based statistics");
        }
    } catch (e: any) {
        dispatch(cityBasedDataFail(e.message || "Failed to fetch city based statistics"));
        throw e;
    }
}

