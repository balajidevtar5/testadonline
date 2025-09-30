import CloseIcon from '@mui/icons-material/Close';
import {
    ArrowBack,
    Star,
} from '@mui/icons-material';
import "../appnotification/appnotification.scss";
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotificationData, updateNotificationIsRead } from '../../redux/slices/notification';
import { RootState } from '../../redux/reducer';
import { ReadInAppNotifications } from '../../redux/services/notification';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import DeletePost from '../../dialog/postDetails/deatepostpopup';
import { LayoutContext } from '../layout/LayoutContext';
import { useTranslation } from 'react-i18next';
import { fetchSettingData } from '../../redux/slices/setting';
import { getData } from '../../utils/localstorage';
import Skeleton from '@mui/material/Skeleton';
import { message } from "antd";
import DarkNoNotification from "../../assets/images/DarkNoNotification.png"
import LightNoNotification from "../../assets/images/LightNoNotification.png"

const AppNotification = (props) => {
    const { isAppNotification, setIsAppNotification } = props
    const [isMarkAllPopupOpen, setIsMarkAllOpen] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch: any = useDispatch();
    const { isDarkMode } = useContext(LayoutContext);
    const { data: notificationData, isLoading } = useSelector(
        (state: RootState) => state.notificationData
    );
    const { data: loginUserData } = useSelector(
        (state: RootState) => state.loginUser
    );

    const { t } = useTranslation()

    // Handle back navigation
    const handleBack = () => {
        setIsAppNotification(false)
    };

    const handleNext = () => {
        setCurrentPage(currentPage + 1)
    }
    const handleNotificationClick = async (data) => {
        if (data.shareposturl != null) {
            window.open(data.shareposturl, '_blank');

        }
        const payload = {
            SelectAll: false,
            NotificationId: data?.id
        }

        if (!data.isread) {
            const respose = await ReadInAppNotifications(payload)
            if (respose?.success) {
                dispatch(updateNotificationIsRead(data?.id, true, false));
                dispatch(fetchSettingData())
            }
        }

    }

    const handleReadAllClick = async () => {
        const payload = {
            SelectAll: true,
            NotificationId: "",
        }
        try {
            const response = await ReadInAppNotifications(payload);
            const visiteduserData = await getData("visitedUser");
            if (response?.success) {
                const fetchPayload = {
                    userId: visiteduserData?.id || loginUserData.data[0]?.id,
                    pageSize: 8,
                    pageNumber: currentPage
                }
                dispatch(updateNotificationIsRead(0, true, true))
                dispatch(fetchNotificationData(fetchPayload));
                dispatch(fetchSettingData());
            }
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        } finally {
            setIsMarkAllOpen(false);
        }
    }

    const handleMarkAsReadClick = () => {
        const unreadNotifications = notificationData?.filter(notification => !notification.isread);

        if (!notificationData || notificationData.length === 0) {
            message.info(t("toastMessage.No notifications to read"));
            return;
        }
        if (!unreadNotifications || unreadNotifications.length === 0) {
            message.info(t("toastMessage.already read all the notifications"));
            return;
        }

        setIsMarkAllOpen(true);
    }

    useEffect(() => {
        const fetchNotifications = async () => {
            const userId = loginUserData?.data?.[0]?.id;
            if (!userId) return;
    
            const payload = {
                userId: userId,
                pageSize: 10,
                pageNumber: currentPage
            };
    
            if (currentPage === 1) {
                setIsInitialLoading(true); 
            }
    
            await dispatch(fetchNotificationData(payload));
            setIsInitialLoading(false); 
        };
    
        fetchNotifications();
    }, [isAppNotification, currentPage]);

    return (
        <div className="notification-page">
            <div className="d-flex align-items-center justify-content-between p-10 border-b-solid header-bar">
                <div className="d-flex align-items-center gap">
                    <ArrowBack className='cursor-pointer font-24 me-2' onClick={handleBack} />
                    <h5 className="m-0">{t("General.Notifications")}</h5>
                </div>
                <div className="d-flex align-items-center gap">
                    <MarkAsUnreadIcon onClick={handleMarkAsReadClick} className='cursor-pointer font-24' />
                </div>
            </div>

            <div className="container py-4">
                <div className="bg-white p-3 rounded shadow-sm notification-icons ">
                    <h6 className="mb-3 text-muted p-10 ">{t("General.Today")}</h6>
                    {isInitialLoading  ? (
                        Array(7).fill(0).map((_, index) => (
                            <div key={index} className="notification-item d-flex gap border-b p-3">
                                <Skeleton variant="circular" width={40} height={40} className="me-3 skeleton-loader" />
                                <div className="w-100">
                                    <Skeleton variant="text" width="60%" height={24} className="mb-2 skeleton-loader" />
                                    <Skeleton variant="text" width="80%" height={20} className="mb-2 skeleton-loader" />
                                    <Skeleton variant="text" width="40%" height={16} className='skeleton-loader' />
                                </div>
                            </div>
                        ))
                    ) : notificationData && notificationData.length > 0 ? (
                        notificationData.map((elm) => (
                            <div
                                key={elm.id}
                                className={`notification-item d-flex gap border-b ${!elm.isread ? 'unread' : 'read'}`}
                                onClick={() => handleNotificationClick(elm)}
                            >
                                <div className="notification-icon bg-warning me-3">
                                    <Star className="cursor-pointer font-20 icons" />
                                </div>
                                <div className="w-100 d-flex justify-content-between align-items-start gap">
                                    <div>
                                        <div className="mb-3 fs-16px notificationtitle">{elm.notificationtitle}</div>
                                        <div className='notificationdes' >
                                            {elm.notificationdesc}
                                        </div>
                                        <div className="text-muted small  date-time-label">{elm.notificationcreated}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="notification-container  py-5 pb-10 abs">
                            <img
                                src={isDarkMode ? DarkNoNotification : LightNoNotification}
                                alt="No Notifications"
                                style={{ maxWidth: '200px' }}
                                className={`${isDarkMode ? "blend-dark notification-img" : ""}`}
                            />
                            <p className="text-muted mt-10" style={{ fontSize: '1rem', fontWeight: '500' }}>{t("General.EmptyNotification")}</p>
                        </div>
                    )}
                    {
                        !isLoading && notificationData.length > 0 && <div className='show-more-btn-container'>
                            {
                                notificationData && notificationData?.length > 0 &&
                                    notificationData?.length < notificationData[0].totalcount ?
                                    <button onClick={handleNext} className="show-more-btn">
                                        <span style={{
                                            color: isDarkMode ? '#ff780c' : ''
                                        }}>{t("General.showMore")}</span>
                                    </button> : <span style={{ color: "#ff780c", padding: "6px 12px" }}>{t("General.No more records")}</span>
                            }
                        </div>
                    }
                </div>

                {isMarkAllPopupOpen && (
                    <DeletePost
                        handleOk={handleReadAllClick}
                        deleteMessage={t(`General.mark all ads as read?`)}
                        open={isMarkAllPopupOpen}
                        handleClose={() => setIsMarkAllOpen(false)}
                        handleDeleteClick={handleReadAllClick}
                    />
                )}
            </div>
        </div>
    );
};

export default AppNotification;