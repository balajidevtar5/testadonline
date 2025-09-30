import { createSlice } from "@reduxjs/toolkit";
import { deepClone } from "../../libs/helper";
import { getCategory } from "../services/post.api";
import { getData, storeData } from "../../utils/localstorage";
import { GetInAppNotifications } from "../services/notification";

export interface notificationDataState {
    data?: any;
    error?: string | null;
    isLoading?: boolean;
}

const notificationDataInitialState: notificationDataState = {
    data: {},
    error: null,
    isLoading: false,
};

export interface notificationDataDataResponse {
    data: any;
    success: boolean;
    message: string;
}

export const notificationDataSlice = createSlice({
    name: "notificationDataSlice",
    initialState: deepClone(notificationDataInitialState),
    reducers: {
        notificationDataStarted: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },

        notificationDataSuccess: (state, action) => {
            // Convert object with numeric keys to array
            const convertObjectToArray = (obj: any) => {
                if (Array.isArray(obj)) return obj;
                if (typeof obj === 'object' && obj !== null) {
                    const keys = Object.keys(obj);
                    // Check if all keys are numeric (like "0", "1", "2", etc.)
                    const allNumericKeys = keys.every(key => !isNaN(Number(key)) && Number.isInteger(Number(key)));
                    if (allNumericKeys && keys.length > 0) {
                        return keys.sort((a, b) => Number(a) - Number(b)).map(key => obj[key]);
                    }
                }
                return obj;
            };

            // Get existing data and convert to array if needed
            const existingData = convertObjectToArray(state.data) || [];
            const responseData = action.payload?.data || action.payload;
            const newData = convertObjectToArray(responseData);
            
            let mergedData;
            
            // If both are arrays, merge them
            if (Array.isArray(existingData) && Array.isArray(newData)) {
                mergedData = [...existingData, ...newData];
            }
            // If new data is array but existing is not
            else if (Array.isArray(newData)) {
                mergedData = newData;
            }
            // Fallback
            else {
                mergedData = newData;
            }

            return {
                ...state,
                data: mergedData,
                error: null,
                isLoading: false,
            };
        },

        // New reducer for appending data specifically
        notificationDataAppend: (state, action) => {
            // Convert object with numeric keys to array
            const convertObjectToArray = (obj: any) => {
                if (Array.isArray(obj)) return obj;
                if (typeof obj === 'object' && obj !== null) {
                    const keys = Object.keys(obj);
                    // Check if all keys are numeric (like "0", "1", "2", etc.)
                    const allNumericKeys = keys.every(key => !isNaN(Number(key)) && Number.isInteger(Number(key)));
                    if (allNumericKeys && keys.length > 0) {
                        return keys.sort((a, b) => Number(a) - Number(b)).map(key => obj[key]);
                    }
                }
                return obj;
            };

            // Get existing data and convert to array if needed
            const existingData = convertObjectToArray(state.data) || [];
            const responseData = action.payload?.data || action.payload;
            const newData = convertObjectToArray(responseData);
            
            let mergedData;
            
            // If both are arrays, merge them
            if (Array.isArray(existingData) && Array.isArray(newData)) {
                // Filter out duplicates based on id (assuming each notification has a unique id)
                const existingIds = existingData.map(item => item.id);
                const filteredNewData = newData.filter(item => !existingIds.includes(item.id));
                mergedData = [...existingData, ...filteredNewData];
            }
            // If new data is array but existing is not
            else if (Array.isArray(newData)) {
                mergedData = newData;
            }
            // Fallback
            else {
                mergedData = Array.isArray(newData) ? newData : [newData];
            }

            return {
                ...state,
                data: mergedData,
                error: null,
                isLoading: false,
            };
        },

        // New reducer for replacing data completely
        notificationDataReplace: (state, action) => {
            // Convert object with numeric keys to array
            const convertObjectToArray = (obj: any) => {
                if (Array.isArray(obj)) return obj;
                if (typeof obj === 'object' && obj !== null) {
                    const keys = Object.keys(obj);
                    // Check if all keys are numeric (like "0", "1", "2", etc.)
                    const allNumericKeys = keys.every(key => !isNaN(Number(key)) && Number.isInteger(Number(key)));
                    if (allNumericKeys && keys.length > 0) {
                        return keys.sort((a, b) => Number(a) - Number(b)).map(key => obj[key]);
                    }
                }
                return obj;
            };

            const responseData = action.payload?.data || action.payload;
            const convertedData = convertObjectToArray(responseData);

            return {
                ...state,
                data: convertedData,
                error: null,
                isLoading: false,
            };
        },

      notificationUpdateIsRead: (state, action) => {
    // Convert object with numeric keys to array
    const convertObjectToArray = (obj: any) => {
        if (Array.isArray(obj)) return obj;
        if (typeof obj === 'object' && obj !== null) {
            const keys = Object.keys(obj);
            const allNumericKeys = keys.every(key => !isNaN(Number(key)) && Number.isInteger(Number(key)));
            if (allNumericKeys && keys.length > 0) {
                return keys.sort((a, b) => Number(a) - Number(b)).map(key => obj[key]);
            }
        }
        return obj;
    };

    const existingData = convertObjectToArray(state.data) || [];
    const { id, isread, isAllRead } = action.payload;

    if (!Array.isArray(existingData)) {
        return state;
    }

    let updatedData;

    if (isAllRead) {
        // Mark all notifications as read
        updatedData = existingData.map(notification => ({
            ...notification,
            isread: true,
        }));
    } else {
        // Update specific notification
        updatedData = existingData.map(notification => {
            if (notification.id === id) {
                return { ...notification, isread };
            }
            return notification;
        });
    }

    return {
        ...state,
        data: updatedData,
    };
},



        notificationDataFail: (state, action) => {
            return {
                ...state,
                error: action.payload,
                isLoading: false
            }
        },

        notificationDataReset: () => {
            return deepClone(notificationDataInitialState);
        }
    }
});


export const { 
    notificationDataStarted, 
    notificationDataSuccess, 
    notificationDataAppend,
    notificationDataReplace,
    notificationDataFail, 
    notificationDataReset ,
    notificationUpdateIsRead
} = notificationDataSlice.actions;

export const fetchNotificationData = (
    payload: { userId: number },
    shouldAppend: boolean = true // Flag to control append vs replace behavior
) => async (dispatch: any) => {
    dispatch(notificationDataStarted());
    try {
        const res: notificationDataDataResponse = await GetInAppNotifications(payload);
        if (res) {
            if (shouldAppend) {
                dispatch(notificationDataAppend(res));
            } else {
                dispatch(notificationDataReplace(res));
            }
        }
    } catch (e: any) {
        dispatch(notificationDataFail(e.message));
    }
};



// New thunk for specifically appending data

// New thunk for replacing data completely
export const replaceNotificationData = (payload: { userId: number }) => async (dispatch: any) => {
    dispatch(notificationDataStarted());
    try {
        const res: notificationDataDataResponse = await GetInAppNotifications(payload);
        if (res) {
            dispatch(notificationDataReplace(res));
        }
    } catch (e: any) {
        dispatch(notificationDataFail(e.message));
    }
};

export const updateNotificationIsRead = (id: string | number, isread: boolean, isAllRead: boolean | any ) => (dispatch: any) => {
    dispatch(notificationUpdateIsRead({ id, isread ,isAllRead}));
};



export const clearNotificationCache = async (languageId: number) => {
    await storeData(`notificationData_${languageId}`, null);
};