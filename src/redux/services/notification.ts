
import { fetch } from "../../libs/helper";


export const GetPostDetailsPostId = async (payload): Promise<any> => {
    return fetch({
        url: `/Notification/GetPostDetailsPostId?postId=${payload.postId}&notificationId=${payload.notificationId}`,
        method: "GET",
    });
};

export const GetInAppNotifications = async (payload): Promise<any> => {
    return fetch({
        url: `/Notification/GetInAppNotifications?UserId=${payload.userId}&pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`,
        method: "GET",
    });
};

export const UpdateInAppNotification = async (payload): Promise<any> => {
    return fetch({
        url: `/Notification/UpdateInAppNotification`,
        method: "GET",
    });
};
export const ReadInAppNotifications = async (payload): Promise<any> => {
    return fetch({
        url: `/Notification/ReadInAppNotifications?SelectAll=${payload.SelectAll}&&NotificationId=${payload.NotificationId}`,
        method: "GET",
    });
};







