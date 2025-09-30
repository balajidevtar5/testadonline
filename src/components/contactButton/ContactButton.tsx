import TelegramIcon from '@mui/icons-material/Telegram';
import { message } from 'antd';
import { t } from 'i18next';
import { GmailIcon } from '../../assets/icons/GmailIcon';
import { TrackContactActivity } from '../../redux/services/user.api';
import { useEffect, useContext, useState } from 'react';
import { getSessionData, storeSessionData } from '../../utils/sessionStorage';
import { logEffect } from '../../utils/logger';
import { LOGEVENTCALL, logEvents } from '../../libs/constant';
import { LayoutContext } from '../../components/layout/LayoutContext';
import { ContactCount } from '../../redux/services/post.api';
import { useDispatch } from 'react-redux';
import { updateContactCount } from '../../redux/slices/postSlice';
// Helper function to save scroll position
const saveScrollPosition = async () => {
    await storeSessionData('scrollPosition', window.scrollY.toString());
};




const getContactCount = (item, contactType) => {

    if (!item) return 0;

    switch (contactType) {
        case 'Call':
            return parseInt(item?.calls || '0');
        case 'Email':
            return parseInt(item?.emails || '0');
        case 'Whatsapp':
            return parseInt(item?.whatsapps || '0');
        case 'Telegram':
            return parseInt(item?.telegrams || '0');
        case 'HideMe':
            return parseInt(item?.hideme || '0');
        default:
            return 0;
    }
};

const ContactButton = ({
    Icon,
    link,
    label,
    item,
    loginUserData,
    setLoginModelOpen,
    setPostDetails,
    selectedCity,
    style,
    onDialerOpen,
    onClick,
    forcedContactType,
    interactionCounts = { contacts: {} },
}: {
    Icon: any,
    link?: string,
    label?: string,
    item: any,
    loginUserData: any,
    style?: any,
    setLoginModelOpen: (d: boolean) => void,
    setPostDetails?: (d: any) => void,
    onDialerOpen?: (item: any, mobileno: number) => void,
    onClick?: () => void,
    selectedCity: number,
    forcedContactType?: string,
    interactionCounts?: { contacts: { [key: string]: { [key: string]: number } } },
}) => {
    const { isDarkMode, updatePostCounts } = useContext(LayoutContext);
    const [latestCounts, setLatestCounts] = useState(null);
    const [displayCount, setDisplayCount] = useState(0);
    const dispatch: any = useDispatch();


    // Contact type mapping
    const contactTypeMap = {
        6: 'Call',
        2: 'Email',
        7: 'Whatsapp',
        4: 'Telegram',
        5: 'HideMe'
    };

    const contactType = forcedContactType || contactTypeMap[item.contacttypeid] || 'Unknown';

    const contactCount = getContactCount(item, contactType);

    const fetchLatestCounts = async (postId) => {

        try {
            const response = await ContactCount(postId);
            if (response?.success && response?.data?.length > 0) {
                setLatestCounts(response.data[0]);
                if (updatePostCounts) {
                    updatePostCounts(postId, response.data[0]);
                }
            }
        } catch (error) {
        }
    };

    //useEffect(() => {
    //    const restoreScrollPosition = async () => {
    //        const savedPosition = await getSessionData('scrollPosition');
    //        if (savedPosition) {
    //            window.scrollTo(0, parseInt(savedPosition));
    //        }
    //    };

    //    // Restore scroll position when the window gets focus (user returns to the app)
    //    window.addEventListener('focus', restoreScrollPosition);

    //    return () => {
    //        window.removeEventListener('focus', restoreScrollPosition);
    //    };
    //}, []);

    const handleTrackActivity = async (postId, typeId) => {

        const payload = {
            LocationId: selectedCity,
            PostId: postId,
            ContactType: contactType,
            UserId: loginUserData?.data[0].id
        };

        try {
            if (contactType === "HideMe") return;
            const response = await TrackContactActivity(payload);
            if (response?.success === true && response?.data?.[0]?.success === 1) {
                fetchLatestCounts(postId);
            } else {
                message.error(t("toastMessage.Failed to track activity."));
            }
        } catch (error) {
            message.error(t("toastMessage.Failed to track activity."));
        }
    };


    const handleButtonClick = (e) => {
        if (loginUserData?.data) {
            e.stopPropagation();
            if (item.isowner) {
                message.info(t('toastMessage.You have created this post.'));
                setPostDetails && setPostDetails(item.id);
            } else {
                if (link) {
                    saveScrollPosition();
                    window.open(link, '_blank');
                }
                if (onClick) {
                    onClick();
                }
                if (LOGEVENTCALL) {
                    logEffect(logEvents.User_Contact);
                }
                dispatch(updateContactCount({
                    post: item,
                    contactType: contactType,
                }));
                if (loginUserData?.data && !item.isowner) {
                    handleTrackActivity(item?.id, item.contacttypeid);
                    if (onDialerOpen) {
                        onDialerOpen(item, item?.mobileno);
                    }
                }
            }
        } else {
            e.stopPropagation();
            setLoginModelOpen(true);
            if (onDialerOpen) {
                onDialerOpen(item, item?.mobileno);
            }
            message.error(
                t(
                    "toastMessage.Please login/register with your mobile number to view contact details of advertisement."
                )
            );
        }
    };


    useEffect(() => {
        const countSource = latestCounts?.id ? getContactCount(latestCounts, contactType) : contactCount;
        setDisplayCount(countSource)

    }, [latestCounts, item])

    return (
        <div className="d-flex align-items-center">
            <div
                className={`text-black d-block text-center cursor-pointer ${item.issold && "disabled"}`}
                onClick={handleButtonClick}
                style={style}
            >
                {Icon}
                {displayCount > 0 && (
                    <p className="font-10 font-500 ml-0 mt-0 mb-0" style={{ color: isDarkMode ? "#767676" : "#7e7e7e" }}>
                        {displayCount}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ContactButton;