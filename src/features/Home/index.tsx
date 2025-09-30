import {
  CloseCircleOutlined,
  EnvironmentOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import "@fancyapps/ui/dist/fancybox.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import {
  Drawer,
} from "@mui/material";
import type { TabsProps } from "antd";
import { Carousel, message, Popover, Tabs } from "antd";
import CryptoJS from "crypto-js";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import notifyBg from "../../assets/images/nocityBg.png";
import rocketBg from "../../assets/images/rocketBg.png";
import Fancybox from "../../components/fancybox/fancyBox";
import FilterComponent from "../../components/filterComponent/FilterComponent";
import { SelectField } from "../../components/formField/FormFieldComponent";
import { LayoutContext } from "../../components/layout/LayoutContext";
import CommonPopover from "../../components/menuspopupover/menuspopover";
import NoDataFoundComponent from "../../components/noDataFound/NoDataFoundComponent";
import { MAIN_COLOR } from "../../config/theme";
import AdOptionDialog from "../../dialog/AdOptionDialog";
import AdvertiseDetailsDialog from "../../dialog/AdvertiseDetailsDialog";
import HideMeDialog from "../../dialog/HidemeDiaglog";
import ImageSliderDialog from "../../dialog/ImageSliderDialog";
import LoginDialog from "../../dialog/LoginDialog";
import ShareDialog from "../../dialog/ShareDialog";
import SuccessDialog from "../../dialog/SuccessDialog";
import PostDetailsDialog from "../../dialog/postDetails/PostDetailDialogContainer";
import DeletePost from "../../dialog/postDetails/deatepostpopup";
import EditPostDialog from "../../dialog/postDetails/editPostDialog";
import PremiumModal from "../../dialog/premiumModal/PremiumModal";
import ProfileDialog from "../../dialog/profileDialog";
import SubCategoryDialog from "../../dialog/subcategorydialog/subcategorydialog";
import {
  Android_app_url,
  Android_Website_app_url,
  API_ENDPOINT_PROFILE,
  colorMap,
  colorMapping,
  COLUMNS_BREAK_POINT,
  contactTypesEnum,
  CURRENT_VERSION,
  IOS_app_url,
  LOGEVENTCALL,
  logEvents,
  NEW_APPURL,
  WHATSAPP_CHANNEL,
} from "../../libs/constant";
import { onClickOfBackToTop } from "../../libs/helper";
import { RootState } from "../../redux/reducer";
import {
  createPost,
  deletePost,
  fetchPostById,
  UpdateCategoryWisePostData,
} from "../../redux/services/post.api";
import HomeStyles from "../css/HomeStyle.module.scss";
import addIcon from "../../assets/images/LOGO.jpg";
import chromeLogo from "../../assets/images/chromelogo.png";
import { GetPostDetailsPostId, ReadInAppNotifications } from "../../redux/services/notification";
import { getData, isStorageAvailable, removeItem } from "../../utils/localstorage";
import { getSessionData, storeSessionData } from "../../utils/sessionStorage";
import { getDecryptedCookie } from "../../utils/useEncryptedCookies";
import { logEffect } from "../../utils/logger";
import ReportPost from "../../dialog/postDetails/resportad";
import { ContactCount } from '../../redux/services/post.api';
import Category from "./components/category";
import { Fotter } from "./components/fotter";
import usePostActionHandler from "./hooks/usePostActionHandler";
import useSharePost from "./hooks/useSharePost";
import { openPremiumImage } from "./functions/openPremiumImage ";
import { openNormalImages } from "./functions/openNormalImages";
import useAvailableSlots from "./hooks/useAvailableSlots";
import { handleReportCommon } from "./functions/handleReport";

import { handleFavorite } from "./functions/handleFavorite";
import useAppVersionHandler from "./hooks/useAppVersionHandler";
import { useTabHandler } from "./hooks/useTabHandler";
import { handlePostDetailClick } from "./functions/handlePostDetailClick";
import { deletePremiumAd, handleSendNotify } from "./functions/handleDeleteAndNotify";
import { fetchCardItems, selectFavoriteData, selectTotalRecords } from "../../redux/slices/postSlice";
import InfiniteScrollComponent from "./components/infiniteScroll";
import { useMarkPostAsRead } from "./hooks/useMarkAsRead";
import { fetchSettingData } from "../../redux/slices/setting";
import { TrackActivity } from "../../redux/services/user.api";
import ShareDialogSelection from "./components/ShareDialogSelection";
const HomePage = () => {
  const {
    filterValue,
    setPostData,
    setFilterValue,
    setIsLoading,
    isLoading,
    setSearchValue,
    searchValue,
    selectedCity,
    setSelectedCity,
    openProfilePopup,
    categoryList,
    setIsPostClear,
    isPostClear,
    prevFilterData,
    premiumPostData,
    selectedLanguage,
    selectedGridOption,
    setAdOptionModalOpen,
    AdOptionModalOpen,
    setIsPremiumAd,
    isPremiumAd,
    showInstallButton,
    setIsFeatchCategoryCount,
    isFeatchCategoryCount,
    setIsRefetch,
    isRefetch,
    setIsScrooling,
    isScrolling,
    slotData,
    refetch,
    setShouldHideBottomNavigation,
    setIsHomeClick,
    setActiveTab
  } = useContext(LayoutContext);
  const { data: loginUserData } = useSelector(
   
    (state: RootState) => state.loginUser
  );
  const { data: cityData } = useSelector((state: RootState) => state.cities);
  const { data: settingData } = useSelector(
    (state: RootState) => state.settingList
  );
  const { postData } = useSelector(
    (state: RootState) => state.post
  );
  const totalRecords = useSelector(selectTotalRecords);
  const selectFavoriteDatas = useSelector(selectFavoriteData);
  const [{ adminAuth }]: any = useCookies(["adminAuth"]);
  const encryptedAdminAuth = getDecryptedCookie(adminAuth)
  const domEl = useRef(null);
  const [openAdDetailsModal, setOpenAdDetailsModal] = useState(false);
  const [isPutAdModalOpen, setIsPutAdModalOpen] = useState(false);
  const [openShareImageModel, setOpenShareImageModel] = useState(false);
  const [openSuccessModal, setOpenSuccessModel] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollToBottom, setIsScrollToBottom] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [myProfilePopup, setMyProfilePopup] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [editPostData, setEditPostData] = useState(null);
  const [shareImageBase64, setShareImgBase64] = useState(null);
  const [isEditPost, setIsEditPost] = useState(false);
  const [isDeletePopup, setIsDeleteDialog] = useState(false);
  const [isMarkAsRead, setIsMarkAsRead] = useState(false);
  const [isDeletePopupPremium, setIsDeleteDialogPremium] = useState(false);
  const [isReportConfirmation, setIsReportConfirmation] = useState(false);
  const [favChecked, setFavChecked] = useState(filterValue?.Favorites);
  const [myPostChecked, setMyPostChecked] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState({});
  const [postFrequency, setPostFrequency] = useState(0);
  const [tags, setTags] = useState([]);
  const [cities, setCities] = useState([]);
  const [loginModelOpen, setLoginModelOpen] = useState(false);
  const [showPostImages, setShowPostImages] = useState(false);
  const [isPremiumAdModalOpen, setIsPremiumAdModalOpen] = useState(false);
  const [slideData, setSlideData] = useState([]);
  const [postDetails, setPostDetails] = useState([]);
  const [dialerMobileNumber, setMobileDialerNumber] = useState("");
  const { register, formState, control, watch } = useForm();
  const watchField = watch();
  const [hasMore, setHasMore] = useState(true);
  const [isRepost, setIsRespost] = useState([]);
  const [clickedCategories, setClickedCategories] = useState([]);
  const [loadingData, setLoadingData] = useState([]);
  const [imageSlideOpen, setImageSlideOpen] = useState(false);
  const [premiumAdData, setPremiumAdData] = useState(null);
  const [premiumAdDataForDelete, setPremiumAdDataForDelete] = useState(null);
  const [combinedPostData, setCombinedPostData] = useState([]);
  const [normalPostData, setNormalPostData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [hideMeDialogShow, setHideMeDialogShow] = useState(false);
  const [subCategoryDialogOpen, setSubCategoryDialogOpen] = useState(false);
  const [subAllCategoryList, setSubAllCategoList] = useState({
    Icon: "",
    Name: "",
  });
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState([]);
  const [subCategoryList, setSubCategoList] = useState([]);
  const [selectedSubCategory, setSelectedSubcategory] = useState([]);
  const [showDiv, setShowDiv] = useState(false);
  const [changeSubCategory, setChangeSubCategory] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isSmallScreen, setIsSmallScreen] = useState(null);
  const [isStaticFav, setIsStaticFav] = useState(false);
  const [navigationKey, setNavigationKey] = useState(0);
  const [filters, setFilters] = useState(null);
  const [visitedUser, setVisitedUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { t } = useTranslation();
  const dispatch: any = useDispatch();
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [interactionCounts, setInteractionCounts] = useState({ favorites: {}, shares: {} });
  const params = new URLSearchParams(window.location.search);
  const { postDetailsId } =  useParams();
  const [selectSharePost,setSelectSharePost] = useState(false)
  const [selectedPost,setSelectedPost] = useState(null)
  console.log("postDetailsId",postDetailsId)

  // const visitedUser : any = await getData('visitedUser');
  const {
    latestVersion,
    showOpenAppButton,
    isIOS,
    isAndroid,
    isAndroidChrome,
    isStandalone,
    redirectToAppOrPlayStore
  } = useAppVersionHandler();

  const { handleTabChange } = useTabHandler(setIsRefetch, isRefetch, dispatch, encryptedAdminAuth);

  interface SafariNavigator extends Navigator {
    standalone?: boolean;
  }
  const formatCount = (count) => {
    const numericCount = Number(count || 0);
    return numericCount > 0 ? numericCount.toString() : null;
  };

  const handleGetPostDetailsById = async (elm) => {
    try {
      setEditPostData(elm);
    } catch (error) {
    }
  };
  const { sharePost } = useSharePost(logEffect);

  const { handleClick } = usePostActionHandler({
    loginUserData,
    setIsPutAdModalOpen,
    setInteractionCounts,
    setFavoriteCount,
    favoriteCount,
    sharePost,
    logEffect,
    setIsStaticFav,
    setIsPostClear,
    filterValue,
    setFilterValue,
    handleGetPostDetailsById,
    setSlideData,
    setShowPostImages,
    setIsRefetch,
    callBack: () => {
      dispatch(fetchCardItems({
        isPremiumAd,
        isPostClear: true,
        filterValue,
        selectedCity,
        setFilterValue,
        prevFilterData,
        selectedLanguage,
        searchValue,
        encryptedAdminAuth,
        setIsLoading,
        isRefetch: true,
        setIsRefetch,
        setPremiumAdData,
        isScrolling,
        setIsPostClear,
        setIsScrooling
      }));
    },
    t,
  });

  const handleTrackActivity = async (postId) => {
    if (!loginUserData || (typeof loginUserData === 'object' && Object.keys(loginUserData).length === 0)) {
      return;
    }
    const payload = {
      PostId: postId,
    };
    try {
      await TrackActivity(payload);
    } catch (error) {
      message.error(t("toastMessage.Failed to track activity."));
    }
  };

  const handleFavoriteClick = (e, item) => {
    handleFavorite({
      e,
      item,
      loginUserData,
      setLoginModelOpen,
      message,
      t,
      setFavoriteCount,
      interactionCounts,
      setInteractionCounts,
      handleClick,
      setIsStaticFav,
      setIsPostClear,
      filterValue,
      setFilterValue
    });
  };

  const { markPostAsRead, loading } = useMarkPostAsRead();
  const handleShareCount = async (e, item) => {
    e.stopPropagation();
    setSelectSharePost(true)
    setSelectedPost(item)

    // try {
    //   const response = await ContactCount(item.id);
    //   if (response?.success) {
    //     setInteractionCounts(prev => ({
    //       ...prev,
    //       shares: {
    //         ...prev.shares,
    //         [item.id]: response?.data[0]?.sharepost
    //       }
    //     }));
    //   }
    // } catch (error) {
    //   console.error("Error updating share count:", error);
    // }


    // handleClick(e, "share", item);
  };


  const handleShare = async (e,value) => {
    e.stopPropagation();

    try {
      const response = await ContactCount(selectedPost.id);
      if (response?.success) {
        setInteractionCounts(prev => ({
          ...prev,
          shares: {
            ...prev.shares,
            [selectedPost.id]: response?.data[0]?.sharepost
          }
        }));
      }
    } catch (error) {
      console.error("Error updating share count:", error);
    }


    handleClick(e, "share", selectedPost,value);
  };



  useEffect(() => {
    setNavigationKey(prev => prev + 1);
  }, [loginUserData]);



  const TabItems: TabsProps["items"] = [
    {
      key: "1",
      label: (<span style={{ color: "#FF8000" }}>
        {t("General.Ads")}
      </span>),
      icon: "📝",
    },
    {
      key: "2",
      label: (<span style={{ color: "#FF8000" }}>{t("General.Premium Ads")}</span>),
      icon: <WorkspacePremiumIcon style={{ marginBottom: "-6px" }} />,
    },
  ];

  const handleShareApp = () => {
    if (navigator.canShare) {
      // const decodedUrl = decodeURIComponent(elm?.shareposturl);
      const appUrl = "Adonline.in";
      navigator
        .share({
          // url: decodedUrl,
          title: "",
          text: `પશુ લે-વેચ, વાહન/જમીન લે-વેચ, ખેત-પેદાશ અને ખેત ઓજાર લે-વેચ, નોકરી અને ધંધા//પ્રોડક્ટ ની જાહેરાતો માટેની *વિશ્વસનીય મોબાઇલ એપ*
ડાઉનલોડ કરો AdOnline.in એપ
*એન્ડ્રોઇડ એપ:*${Android_app_url}
*IOS એપ:* ${IOS_app_url}`,
        })
      //.then(() => console.log("Shared successfully"))
      //.catch((error) => console.log("Error sharing:", error));
    }
  };





  const handlePremiumClick = async (elm) => {
    openPremiumImage({
      elm,
      API_ENDPOINT_PROFILE,
      setSlideData,
      setShowPostImages,
      setImageSlideOpen,
      handleGetPostDetailsById
    });
  };

  const handleNormalImageClick = async (elm) => {
    setSlideData([]); // Clear previous slide data
    if (elm.pictures && elm.pictures?.length > 0) {
      // Check if elm.image is an array and has items
      const slideData = JSON?.parse(elm.pictures)?.map((elm) => {
        const imagePath = elm?.LargeImage ? elm.LargeImage.replace(/^~/, "") : "";
        const imageUrl = `${API_ENDPOINT_PROFILE}/${imagePath}`; // Remove the tilde  const imageUrl = `${API_ENDPOINT}/${imagePath}`;
        return { key: elm?.id, image: imageUrl };
      });

      setShowPostImages(true); // Show post images modal
      setSlideData(slideData); // Set the slide data with the mapped images

      setTimeout(() => {
        const images: any = document.querySelectorAll(
          "a[data-fancybox='gallery']"
        );
        if (images?.length > 0) {
          images[0].click();
        }
      }, 500);
    }
    handleTrackActivity(elm.id);

    handleGetPostDetailsById(elm); // Fetch post details by ID
  };

  const handleNormaAdClick = async (elm, imageArr?: any) => {
    openNormalImages({
      elm,
      API_ENDPOINT_PROFILE,
      setSlideData,
      setShowPostImages,
      setImageSlideOpen,
      handleGetPostDetailsById,
    });
  };

  const handleNextLoad = () => {
    if (isPostClear) {
      setIsPostClear(false);
    }
    // if (loadingData?.length === 0) {
    //   setHasMore(false);
    // }
    if (postData?.length >= totalRecords) {
      return;
    }
    setFilterValue({ ...filterValue, PageNumber: filterValue.PageNumber + 1 });
    setIsLoading(false);
    setIsPostClear(false);
    setIsScrooling(true)

  };



  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = (data) => {
    setIsRespost(editPostData);
    setIsPutAdModalOpen(true);
    setIsEditPost(true)
  };

  const handleRepost = async (data) => {
    setIsRespost(editPostData);
    setIsPutAdModalOpen(true);
    setIsEditPost(false)
  };

  const handleReport = async (note) => {
    handleReportCommon({
      note,
      editPostData,
      loginUserData,
      t,
      setIsLoading,
      setIsReportConfirmation,
      LOGEVENTCALL
    });
  };

  const handleDeletePopupClose = () => {
    setIsDeleteDialog(true);
    setAnchorEl(null);
  };

  const handleMarkAsSold = () => {
    setIsMarkAsRead(true);
    setAnchorEl(null);
  };



  const onDialerOpen = async (item, mobileNo) => {
    if (mobileNo && encryptedAdminAuth && window.innerWidth <= 768) {
      window.location.href = `tel:${mobileNo}`;
    } else if (!encryptedAdminAuth) {
      // const res = await fetchPostById(id);

      setLoginModelOpen(true);
      setMobileDialerNumber(item?.mobileno);
      // message.error(
      //   t(
      //     "toastMessage.Please login/register with your mobile number to view contact details of advertisement."
      //   )
      // );
    }
  };

  const handleDeleteClick = async () => {
    const response =
      loginUserData.data[0]?.roleid === 3 &&
        loginUserData.data[0]?.id === editPostData.userid
        ? await deletePost(editPostData.id, selectedCity, editPostData.userid) // Pass third parameter when condition is met
        : await deletePost(editPostData.id, selectedCity, 0);
    setIsLoading(true);
    try {
      if (response?.success) {
        message.success(response.message);
        setIsRefetch(true)
        handleClose();
        setIsLoading(false);
        setIsDeleteDialog(false);
        setIsPostClear(true);
        setFilterValue({ ...filterValue, PageNumber: 1 });
      } else {
        message.error(response.message);
      }
    } catch (error) {
    }
  };

  const handleMarkAsReadClick = async () => {
    markPostAsRead(editPostData, () => {
      setIsMarkAsRead(false);
      dispatch(fetchCardItems({
        isPremiumAd,
        isPostClear: true,
        filterValue,
        selectedCity,
        setFilterValue,
        prevFilterData,
        selectedLanguage,
        searchValue,
        encryptedAdminAuth,
        setIsLoading,
        isRefetch: true,
        setIsRefetch,
        setPremiumAdData,
        isScrolling,
        setIsPostClear,
        setIsScrooling
      }));
    });
  };


  const handlePostDetailClickWrapper = async (data) => {
    await handlePostDetailClick({
      data,
      setPostDetails,
      setSlideData,
      setImageSlideOpen,
      API_ENDPOINT_PROFILE,
      LOGEVENTCALL,
      handleTrackActivity
    });
  };



  const handlePremiumAdEditClick = (data) => {
    setPremiumAdData(data);
    setIsPremiumAdModalOpen(true);
  };

  const handlePremiumAdRepostClick = (data) => {
    setEditPostData(data);
    setPremiumAdData([])
    setIsPremiumAdModalOpen(true);
  };


  const handleDeletePremiumAd = async (data) => {
    await deletePremiumAd({
      premiumAdDataForDelete: data,
      setIsLoading,
      setIsPostClear,
      setFilterValue,
      filterValue,
      setIsDeleteDialogPremium,
      LOGEVENTCALL,
      setIsRefetch,
      onSucess: () => {
        dispatch(fetchCardItems({
          isPremiumAd: true,
          isPostClear,
          filterValue,
          selectedCity,
          setFilterValue,
          prevFilterData,
          selectedLanguage,
          searchValue,
          encryptedAdminAuth,
          setIsLoading,
          isRefetch: true,
          setIsRefetch,
          setPremiumAdData,
          isScrolling,
          setIsPostClear,
          setIsScrooling
        }));
      }
    });
  };

  const handleSendNotifyWrapper = async () => {
    await handleSendNotify({
      loginUserData,
      postDetails,
      setHideMeDialogShow,
      message
    });
  };




  useEffect(() => {
    if (loginUserData?.data?.length > 0) setActiveStep(1);
    else setActiveStep(0);
  }, [loginUserData]);

  const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true; // Handle primitive values or exact reference match

    if (
      typeof obj1 !== "object" ||
      typeof obj2 !== "object" ||
      obj1 === null ||
      obj2 === null
    ) {
      return false; // Handle cases where either value is not an object or is null
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false; // Check if objects have different numbers of keys

    for (let key of keys1) {
      if (!keys2.includes(key)) return false; // Check if the key exists in both objects
      if (!deepEqual(obj1[key], obj2[key])) return false; // Recursive comparison for nested objects
    }

    return true;
  };

  const handleSubCategoryClose = (item) => {
    setSubCategoList((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((i) => i !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };


  const handleSubCategoryChange = () => {
    setSubCategoryDialogOpen(true);
    setChangeSubCategory(true);
  };



  useEffect(() => {
    if (cityData?.data?.length > 0) {
      const convertibleArray = cityData.data.map((elm) => ({
        label: elm?.city,
        value: elm?.id,
      }));
      setCities(convertibleArray);
    }
  }, [cityData]);


  // useEffect(() => {
  //   if (watchField?.city?.value) {
  //     setSelectedCity(watchField?.city?.value);
  //   }
  // }, [watchField?.city?.value]);

  useEffect(() => {
    const mergeData = () => {
      let mergedData = [];
      let premiumIndex = 0;
      for (let i = 0; i < postData?.length; i++) {
        while (
          premiumIndex < premiumPostData?.length &&
          premiumPostData[premiumIndex].rownumber === i
        ) {
          mergedData.push(premiumPostData[premiumIndex]);
          premiumIndex++;
        }
        mergedData.push(postData[i]);
      }

      while (premiumIndex < premiumPostData?.length) {
        mergedData.push(premiumPostData[premiumIndex]);
        premiumIndex++;
      }

      setCombinedPostData(mergedData);
    };

    if (postData?.length > 0 || premiumPostData?.length > 0) {
      mergeData();
    }

    // encryptMobileNumber("+917847584759",cryptoSecretKey)
  }, [postData, premiumPostData]);

  useEffect(() => {
    if (isStandalone() && latestVersion && CURRENT_VERSION < latestVersion) {
      navigate("/update");
    }
  }, [latestVersion, navigate]);

  useEffect(() => {
    const hasChanged = !deepEqual(filterValue, prevFilterData);
    if (hasChanged || isPostClear && selectedCity ) {
      dispatch(fetchCardItems({
        isPremiumAd,
        isPostClear,
        filterValue,
        selectedCity,
        setFilterValue,
        prevFilterData,
        selectedLanguage,
        searchValue,
        encryptedAdminAuth,
        setIsLoading,
        isRefetch,
        setIsRefetch,
        setPremiumAdData,
        isScrolling,
        setIsPostClear,
        setIsScrooling
      }));
      setIsDataLoaded(false);
      setIsPostClear(false)
    }
  }, [filterValue, prevFilterData]);


  useEffect(() => {
    // Check if serviceWorker is supported
    if ('serviceWorker' in navigator) {
      const messageHandler = async (event) => {
        
        if (event.data.type === 'NOTIFICATION_CLICK') {
          if (LOGEVENTCALL) {
            logEffect(logEvents.Notification_Click)
          }
          const postId = event.data.postId;
          const notificationId = event.data.notificationId;
          if (notificationId) {
            const readNotificationPayload = {
              SelectAll: false,
              NotificationId: notificationId
            }
            ReadInAppNotifications(readNotificationPayload)
            dispatch(fetchSettingData())
          }

          if (postId) {
            const payload = {
              postId: postId,
              notificationId: notificationId
            };
            const response = await GetPostDetailsPostId(payload);
            if (response?.success) {
              if (response.data[0].pictures != null) {
                const slideData = JSON?.parse(response.data[0].pictures)?.map((elm) => {
                  const imagePath = elm?.LargeImage ? elm.LargeImage.replace(/^~/, "") : "";
                  const imageUrl = `${API_ENDPOINT_PROFILE}/${imagePath}`;
                  return { key: elm?.id, adsimage: imageUrl };
                });

                setSlideData(slideData);
              }
              setPostDetails(response.data[0]);
              setImageSlideOpen(true);
            }
          }

        }
      };

      // Add message event listener
      navigator.serviceWorker.addEventListener('message', messageHandler);

      // Cleanup function to remove event listener when component unmounts
      return () => {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
      };
    }
  }, []); // Empty dependency array ensures this effect runs once when the component mounts




  useEffect(() => {
    if (settingData && settingData?.data?.length > 0) {
      let messageKey = "";

      switch (selectedLanguage) {
        case 1:
          messageKey = "WhatsappContactEnglish";
          break;
        case 2:
          messageKey = "WhatsappContactGujarati";
          break;
        case 3:
          messageKey = "WhatsappContactHindi";
          break;
        default:
          messageKey = "WhatsappContactEnglish"; // Default fallback
      }
      const fetchWhatsappMsg = async () => {
        const foundMessage = await settingData?.data?.find((item) => item.name === messageKey);
        if (foundMessage) {
          setWhatsappMessage(foundMessage.value);
        }
      }
      fetchWhatsappMsg();
    }
  }, [selectedLanguage, settingData]);


  useEffect(() => {
    const setisShowOpenAppPopup = async () => {
      if (!window.matchMedia("(display-mode: standalone)").matches && !isIOS() && window.innerWidth <= 776) {
        const isFirstTime = await getSessionData("isShowOpenAppPopup");

        if (!isFirstTime) {
          // Show the div for the first-time visit
          setShowDiv(true);
          document.body.style.overflow = "hidden"
          // Set a flag in localStorage to indicate the user has visited
          await storeSessionData("isShowOpenAppPopup", "true");
        }
      }
    }
    setFilterValue({ ...filterValue, Search: searchValue })
    setisShowOpenAppPopup()
  }, [])


  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1375);
    };

    window.addEventListener("resize", handleResize);
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
        setIsScrollToBottom(true);
      } else {
        setIsScrolled(false);
      }
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        setIsScrollToBottom(false);
      }
    };
    setShouldHideBottomNavigation(false);
    setIsHomeClick(true);
    setActiveTab(1);
    handleResize();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
    // Clean up event listener on unmount
  }, []);

  useEffect(() => {
    const selectedSubCategoryValues = categoryList?.data?.find(
      (elm) => elm.id === clickedCategories[0]
    );
    // if(selectedSubCategory?.length > 0){
    setSelectedSubcategory([]);
    setSubAllCategoList({ Icon: "", Name: "" });
    if (selectedSubCategoryValues) {
      const parsedSubcategory = JSON.parse(
        selectedSubCategoryValues?.subcategory
      );
      setSelectedSubcategory(parsedSubcategory);

      // setSubAllCategoList([])
    }
  }, [categoryList?.data]);

  useEffect(() => {
    if (selectedSubCategory) {
      const selectedSubCateGory = selectedSubCategory.find(
        (elm) => elm.SubCategoryId === selectedSubCategoryId
      );

      if (selectedSubCateGory) {
        setSubAllCategoList(selectedSubCateGory);
      } else {
        console.warn("No matching subcategory found");
        setSubAllCategoList({ Name: "", Icon: "" }); // Set an empty array if no match is found
      }
    }
  }, [selectedSubCategory, selectedSubCategoryId]);

  useEffect(() => {
    if (subCategoryList?.length > 0) {
      setFilterValue((prevFilterValue) => ({
        ...prevFilterValue,
        SubCategoryId: subCategoryList.map((elm) => elm.id).join(","),
      }));
    }
  }, [subCategoryList]);

  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      if (imageSlideOpen && event.state && event.state.dialogOpen) {
        setImageSlideOpen(false);
      }

      if (AdOptionModalOpen && event.state && event.state.dialogOpen) {
        setAdOptionModalOpen(false);
      }
      if (isPutAdModalOpen && event.state && event.state.dialogOpen) {
        setIsPutAdModalOpen(false);
      }
    };

    if (imageSlideOpen) {
      window.history.pushState(null, "");
      window.addEventListener("popstate", handlePopState);
    }

    if (AdOptionModalOpen) {
      window.history.pushState(null, "");
      window.addEventListener("popstate", handlePopState);
    }

    if (isPutAdModalOpen) {
      window.history.pushState(null, "");
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [imageSlideOpen, isPutAdModalOpen, AdOptionModalOpen]);


  useEffect(() => {
    const fetchPostData = async () => {
      if (postDetailsId) {

        const response = await fetchPostById(postDetailsId);
        if (response?.success) {
          if (response.data[0].pictures != null) {
            const slideData = JSON?.parse(response.data[0].pictures)?.map((elm) => {
              const imagePath = elm?.LargeImage ? elm.LargeImage.replace(/^~/, "") : "";
              const imageUrl = `${API_ENDPOINT_PROFILE}/${imagePath}`;
              return { key: elm?.id, adsimage: imageUrl };
            });

            setSlideData(slideData);
          }
          setPostDetails(response.data[0]);
          setImageSlideOpen(true);
        }
      }
    }

    fetchPostData();

    return () => {

    }
  }, [postDetailsId])


  const formatMobileNumber = (mobileNumber) => {
    return mobileNumber
  };

  const { isDarkMode } = useContext(LayoutContext);

  // useEffect(() => {
  //   if (state?.shouldRefresh) {
  //     // Reset page number and clear existing data
  //     setFilterValue({ ...filterValue, PageNumber: 1 });
  //     setIsPostClear(true);
  //     // Fetch fresh data
  //     dispatch(fetchCardItems({
  //       isPremiumAd,
  //       isPostClear,
  //       filterValue,
  //       selectedCity,
  //       prevFilterData,
  //       selectedLanguage,
  //       searchValue,
  //       encryptedAdminAuth,
  //       setIsLoading
  //     }));
  //     // Clear the state after refresh
  //     window.history.replaceState({}, document.title);
  //   }
  // }, [state?.shouldRefresh]);


  return (
    <>
      <div className={`footer footerWithScrollBtn`}>
        <Fotter />
      </div>
      <div className="main mt-60">
        {  filterValue?.UserId === 0 && (
          <Category
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          setIsPostClear={setIsPostClear}
          setIsLoading={setIsLoading}
          setSubCategoryDialogOpen={setSubCategoryDialogOpen}
          setSubAllCategoList={setSubAllCategoList}
          setIsFeatchCategoryCount={setIsFeatchCategoryCount}
          setSelectedSubcategory={setSelectedSubcategory}
          HomeStyles={HomeStyles}
        />
        )

        }

        {subCategoryDialogOpen && filterValue?.UserId === 0 && (
          <SubCategoryDialog
            open={subCategoryDialogOpen}
            clickedCategories={clickedCategories}
            handleClose={() => {
              setSubCategoryDialogOpen(false);
            }}
            selectedSubCategory={selectedSubCategory}
            changeSubCategory={changeSubCategory}
            subCategoryData={[subAllCategoryList]}
            subCategoryDialogOpen={subCategoryDialogOpen}
            handleOk={(resp) => {
              setSubCategoryDialogOpen(false); // After the animation, fully close the dialog
              setFilterValue((prevFilterValue) => ({
                ...prevFilterValue,
                SubCategoryId: resp.map((elm) => elm.SubCategoryId).join(","),
              }));
              setSubAllCategoList(resp[0]);
              setIsPostClear(true);
              setIsLoading(true);
              setSelectedSubCategoryId(resp[0].SubCategoryId);
            }}
          />
        )}
        {subAllCategoryList.Name != "" && !subCategoryDialogOpen &&  filterValue?.UserId === 0 && (
          <div className="px-12 list-style-none d-flex justify-content-between subcategory-data slide-in-bottom">
            <div>
              <ul className="mt-0 mb-0 pl-0 subcategory-position">
                <li className="subcategory-box">
                  <img
                    src={`${API_ENDPOINT_PROFILE}/SubCategoryIcon/${subAllCategoryList?.Icon}`}
                    alt={subAllCategoryList?.Name}
                  />
                  <span>{subAllCategoryList?.Name}</span>
                  <a href="#">
                    <CloseCircleOutlined
                      onClick={() => {
                        // Set the sub category list to an empty object
                        setFilterValue({ ...filterValue, SubCategoryId: null });
                        setSelectedSubcategory([])
                        setSubCategoryDialogOpen(false);
                        setSelectedSubCategoryId([])
                        setClickedCategories([]);
                        setIsPostClear(true);
                        setIsLoading(true);
                      }}
                    />
                  </a>
                </li>
                <li>
                  <button
                    className="button continue"
                    onClick={() => setSubCategoryDialogOpen(true)}
                  >
                    Change
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="position-relative">
          {!isLoading && postData?.length === 0 && (
            <NoDataFoundComponent />
          )}

          <InfiniteScrollComponent
            // Data props
            postData={postData}
            totalRecords={totalRecords}
            hasMore={hasMore}
            isLoading={isLoading}
            isDataLoaded={isDataLoaded}
            handleMarkAsSold={handleMarkAsSold}
            isSmallScreen={isSmallScreen}

            // Filter and state props
            filterValue={filterValue}
            loginUserData={loginUserData}
            selectedGridOption={selectedGridOption}
            isDarkMode={isDarkMode}
            isPremiumAd={isPremiumAd}
            slotData={slotData}

            // Handler functions
            handleNextLoad={handleNextLoad}
            onTabChange={handleTabChange}
            handlePremiumClick={handlePremiumClick}
            handlePremiumAdEditClick={handlePremiumAdEditClick}
            handlePremiumAdRepostClick={handlePremiumAdRepostClick}
            setIsDeleteDialogPremium={setIsDeleteDialogPremium}
            setPremiumAdDataForDelete={setPremiumAdDataForDelete}
            setIsReportConfirmation={setIsReportConfirmation}
            setEditPostData={setEditPostData}
            handleClose={handleClose}
            handlePostDetailClick={handlePostDetailClickWrapper}
            handleNormalImageClick={handleNormalImageClick}
            handleFavorite={handleFavoriteClick}
            handleShareCount={handleShareCount}
            handleClick={handleClick}
            handleEditClick={handleEditClick}
            handleRepost={handleRepost}
            handleDeletePopupClose={handleDeletePopupClose}
            setHideMeDialogShow={setHideMeDialogShow}
            setPostDetails={setPostDetails}
            setLoginModelOpen={setLoginModelOpen}
            handleShareApp={handleShareApp}
            handleTrackActivity={handleTrackActivity}

            // UI state functions
            setAdOptionModalOpen={setAdOptionModalOpen}
            setIsPutAdModalOpen={setIsPutAdModalOpen}
            setIsPremiumAdModalOpen={setIsPremiumAdModalOpen}
            setIsRespost={setIsRespost}
            setPremiumAdData={setPremiumAdData}
            setIsEditPost={setIsEditPost}
            setIsMarkAsRead={setIsMarkAsRead}

            // Other props
            favoriteCount={favoriteCount}
            interactionCounts={interactionCounts}
            formatCount={formatCount}
            whatsappMessage={whatsappMessage}
            formatMobileNumber={formatMobileNumber}
            onDialerOpen={onDialerOpen}
            t={t}
            colorMapping={colorMapping}
            selectedCity={selectedCity}
            myPostChecked={myPostChecked}
            HomeStyles={HomeStyles}
            COLUMNS_BREAK_POINT={COLUMNS_BREAK_POINT}
            setShouldHideBottomNavigation={setShouldHideBottomNavigation}
            setIsRefetch={setIsRefetch}
          />

          {!window.matchMedia("(display-mode: standalone)").matches && !isIOS() && showOpenAppButton && (
            <div>
              <div className="openappbutton" onClick={redirectToAppOrPlayStore}>
                <span>🚀 {t("General.Open App")}</span>
              </div> 

              {showDiv && !window.matchMedia("(display-mode: standalone)").matches && !isIOS() && (
                <div className="openappbuttoncontainer">
                  <div className="modal-overlay">
                    <div className="modal-container">
                      <div className="modal-options">
                        <div className="openappdiv">
                          <div className="d-flex align-items-center gap">
                            <img src={addIcon} height={"50px"} width={"50px"} />
                            <div>{t("General.Easy to see")}</div>
                          </div>
                          <button
                            className="open-app-btn"
                            onClick={redirectToAppOrPlayStore}
                          >
                            {t("General.Open the app")}
                          </button>
                        </div>
                        <div className="contiebrowsediv">
                          <div className="d-flex align-items-center gap">
                            <img src={chromeLogo} width={"50px"} />
                            <div>{t("General.In the browser")}</div>
                          </div>
                          <button
                            className="continue-browser-btn"
                            onClick={() => { setShowDiv(false); document.body.style.overflow = "auto" }}
                          >
                            {t("General.Continue")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}



            </div>
          )}

          {isScrolled && (
            <div
              className="scrollToTop  cursor-pointer"
              onClick={() => onClickOfBackToTop()}
            >
              <KeyboardArrowUpIcon />
            </div>
          )}
        </div>

        {/* <div className={HomeStyles.bottomNavigation}>
          <BottomNavigation
            showLabels={true}
            key={navigationKey}
            className="bottom-navigation"
            sx={{
              justifyContent: "space-between",
              paddingBottom: isIOS() ? "20px" : "2px",
            }}
          >
            {BottomNavigationMenu?.map((d, index) => (
              <BottomNavigationAction
                onClick={handleTabButtonClick}
                key={index}
                label={d?.label}
                icon={d.icon}
                style={{ paddingBottom: "50px" }}
                className={d?.type === "AddPost" ? "add-btn-position" : ""}
              />
            ))}
          </BottomNavigation>
        </div> */}
      </div>

      <div className={!loginUserData?.data ? "d-none d-xs-none" : "d-xs-none"}>
        {/* <Fab
          color="primary"
          aria-label="add"
          className={HomeStyles.filter_icon}
          onClick={() => setOpenDrawer(!openDrawer)}
        >
          <FilterAltIcon className={HomeStyles.icon} />
        </Fab> */}
      </div>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{ width: "26vw" }}
      >
        <FilterComponent
          {...{
            setPostFrequency: setPostFrequency,
            setSearchValue: setSearchValue,
            setTags: setTags,
            searchValue: searchValue,
            tags: tags,
            postFrequency: postFrequency,
            setFavChecked: setFavChecked,
            favChecked: favChecked,
            myPostChecked: myPostChecked,
            setMyPostChecked: setMyPostChecked,
            onClose: () => setOpenDrawer(false),
          }}
        />
      </Drawer>

      {openAdDetailsModal && (
        <AdvertiseDetailsDialog
          {...{
            open: openAdDetailsModal,
            handleClose: () => {
              setOpenAdDetailsModal(false);
            },
          }}
        />
      )}
      {openShareImageModel && (
        <ShareDialog
          {...{
            open: openShareImageModel,
            shareImageBase64: shareImageBase64,
            handleClose: () => {
              setOpenShareImageModel(false);
            },
          }}
        />
      )}
      {openSuccessModal && (
        <SuccessDialog
          {...{
            open: openSuccessModal,
            handleClose: () => {
              setOpenSuccessModel(false);
            },
          }}
        />
      )}
      {isPutAdModalOpen && (
        <PostDetailsDialog
          {...{
            open: isPutAdModalOpen,
            isEdit: true,
            handleClose: (event, reason) => {
              if (reason && reason === "backdropClick") return;
              setIsPutAdModalOpen(false);
            },
            isRepost: isRepost,
            handleOk: (response) => {
              if (activeStep === 0 && response?.success)
                setActiveStep(activeStep + 1);
              if (activeStep === 1 && response?.success) {
                setIsPutAdModalOpen(false);
                message.success(response.message);
                refetch()
                setIsPostClear(true);
                setFilterValue({ ...filterValue, PageNumber: 1 });
              }
            },
            isEditPost: isEditPost,
            editPostData: editPostData,
            activeStep: activeStep,
            setActiveStep: setActiveStep,
          }}
        />
      )}
      {myProfilePopup && (
        <ProfileDialog
          {...{
            open: myProfilePopup,
            cities: cityData,
            handleClose: () => {
              setMyProfilePopup(false);
            },
            handleOk: () => {
              setMyProfilePopup(false);
            },
          }}
        />
      )}
      {/* {isEditPost && (
        <SmoothPopup
          onClose={() => setIsEditPost(false)}
          sx={{ m: "0px" }}
          open={isEditPost}
          maxWidth="xs"
          fullWidth
          className="edit-post-dialog"
          disableEscapeKeyDown={true}
          PaperProps={{
            className: "w-100 edit-post-dialog",
          }}
        // hideBackdrop
        >
          <EditPostDialog
            handleOk={(response) => {
              if (activeStep === 0 && response?.success)
                setActiveStep(activeStep + 1);
              setIsPostClear(true);
              if (activeStep === 1 && response.success) {
                setFilterValue({ ...filterValue, PageNumber: 1 });
                setIsPostClear(true);
              }
            }}
            postEditData={(data, imageArray, id) => {
              const updatedImageData = imageArray.map((elm) => ({
                key: elm.key,
                adsimage: elm.value
              }));

              const updatedData = postData.map((item) =>
                item.id === id ? { ...item, image: updatedImageData } : item
              );

              // Assuming you want to update postData state or a variable
              setPostData(updatedData);
            }}
            editPostData={editPostData}
            open={isEditPost}
            handleClose={() => setIsEditPost(false)}
          />
        </SmoothPopup>
      )} */}
      {isDeletePopup && (
        <DeletePost
          handleOk={(response) => {
            if (activeStep === 0 && response?.success) {
              setActiveStep(activeStep + 1);
              if (LOGEVENTCALL) {
                logEffect(logEvents.Delete_Post)
              }
            }
            if (activeStep === 1 && response.success) {
              dispatch(fetchCardItems({
                isPremiumAd,
                isPostClear,
                filterValue,
                selectedCity,
                selectedLanguage,
                prevFilterData,
                searchValue,
                encryptedAdminAuth,
                setIsLoading,
                isRefetch: true
              }));
              setIsPostClear(true);
              setIsLoading(true);
              if (LOGEVENTCALL) {
                logEffect(logEvents.Delete_Post)
              }
            }
          }}
          deleteMessage={`${t("General.Are you sure you want to delete")} "${editPostData?.title
            }" ${t("General.Post")}?`}
          editPostData={editPostData}
          open={isDeletePopup}
          handleClose={() => setIsDeleteDialog(false)}
          handleDeleteClick={handleDeleteClick}
        />
      )}

      {isMarkAsRead && (
        <DeletePost
          handleOk={(response) => {
            if (activeStep === 0 && response?.success) {
              setActiveStep(activeStep + 1);
              if (LOGEVENTCALL) {
                logEffect(logEvents.Delete_Post)
              }
            }
            if (response.success) {
              dispatch(fetchCardItems({
                isPremiumAd,
                isPostClear,
                filterValue,
                selectedCity,
                selectedLanguage,
                prevFilterData,
                searchValue,
                encryptedAdminAuth,
                setIsLoading,
                isRefetch: true,
                setIsRefetch,
                setPremiumAdData,
                isScrolling,
                setIsPostClear,
                setIsScrooling
              }));
              setIsPostClear(true);
              setIsLoading(true);
              // if (LOGEVENTCALL) {
              //   logEffect(logEvents.Delete_Post)
              // }
            }
          }}
          deleteMessage={`${t("General.MarkAsSoldMsg")} "${editPostData?.title
            }" ${t("General.Post")}?`}
          editPostData={editPostData}
          open={isMarkAsRead}
          handleClose={() => setIsMarkAsRead(false)}
          handleDeleteClick={handleMarkAsReadClick}
        />
      )}

      {isDeletePopupPremium && (
        <DeletePost
          handleOk={(response) => {
            if (activeStep === 0 && response?.success)
              setActiveStep(activeStep + 1);
            if (LOGEVENTCALL) {
              logEffect(logEvents.Delete_Post)
            }
            if (activeStep === 1 && response?.success) {
              dispatch(fetchCardItems({
                isPremiumAd,
                isPostClear,
                filterValue,
                selectedCity,
                selectedLanguage,
                prevFilterData,
                searchValue,
                encryptedAdminAuth,
                setIsLoading,
              }));
              if (LOGEVENTCALL) {
                logEffect(logEvents.Delete_Post)
              }
              setIsPostClear(true);
              setIsLoading(true);
            }
          }}
          deleteMessage={t(
            `General.Are you sure you want to delete`
          )}
          editPostData={editPostData}
          open={isDeletePopupPremium}
          handleClose={() => setIsDeleteDialogPremium(false)}
          handleDeleteClick={() => handleDeletePremiumAd(premiumAdDataForDelete)}
        />
      )}

      {isReportConfirmation && (
        <ReportPost
          deleteMessage={
            <span style={{ color: isDarkMode ? "#fff" : "#000" }}>
              {t(`General.Are you sure you want to report this ad?`)}
            </span>
          }
          editPostData={editPostData}
          open={isReportConfirmation}
          isLoading={isLoading}
          handleClose={() => setIsReportConfirmation(false)}
          handleReportClick={(response) => { handleReport(response) }}
        />
      )}

      {hideMeDialogShow && (
        <HideMeDialog
          handleOk={(response) => {
            if (activeStep === 0 && response?.success)
              setActiveStep(activeStep + 1);
            if (activeStep === 1 && response?.success) {
              dispatch(fetchCardItems({
                isPremiumAd,
                isPostClear,
                filterValue,
                selectedCity,
                selectedLanguage,
                prevFilterData,
                searchValue,
                encryptedAdminAuth,
                setIsLoading
              }));
              setIsPostClear(true);
              setIsLoading(true);
            }
          }}
          deleteMessage={`${t(
            "General.Do you want to share your contact information with the owner?"
          )}`}
          editPostData={editPostData}
          open={hideMeDialogShow}
          handleClose={() => setHideMeDialogShow(false)}
          handleDeleteClick={handleSendNotifyWrapper}
        />
      )}

      {loginModelOpen && (
        <LoginDialog
          open={loginModelOpen}
          handleClose={(event, reason) => {
            // Prevent closing on backdrop click
            if (reason && reason === "backdropClick") return;
            setLoginModelOpen(false);
          }}
          handleOk={(res) => {
            setLoginModelOpen(false);
            // if (res && window.innerWidth <= 768) {
            //   window.location.href = `tel:${dialerMobileNumber}`;
            // }
          }}
        />
      )}
      {showPostImages && (
        <Fancybox>
          {slideData.map((elm, index) => (
            <a
              data-fancybox="gallery"
              href={elm.image}
              key={`fancybox-${index}`}
            />
          ))}
        </Fancybox>
      )}

      {imageSlideOpen && (
        <ImageSliderDialog
          open={imageSlideOpen}
          imagedatas={slideData}
          responseDetailsData={postDetails}
          setLoginModelOpen={setLoginModelOpen}
          handleClose={() => { navigate("/"); setImageSlideOpen(false) }}
          favoriteCount={favoriteCount}
          handleClick={(e, elm, imageArr) => handleClick(e, elm, imageArr)}
          handleMarkAsSold={handleMarkAsSold}
          handleEditClick={(elm) => handleEditClick(elm)}
          handleRepost={(data) => handleRepost(data)}
          handleDeletePopupClose={() => handleDeletePopupClose()}
          postDetailsId={postDetailsId}
          setIsReportConfirmation={() => setIsReportConfirmation(true)}
          setEditPostData={(data) => setEditPostData(data)}
          handlePremiumClick={(elm, imageArr) =>
            handleNormaAdClick(elm, imageArr)
          }
          handleOk={(resp, data) => {
            if (resp === "hideme") {
              if (data?.isowner) {
                message.info(t("toastMessage.You have created this post."));
              } else {
                setHideMeDialogShow(true);
                setPostDetails(data.id);
                setImageSlideOpen(false);
              }
            }
          }}
          onDialerOpen={onDialerOpen}
          interactionCounts={interactionCounts}
          selectedGridOption={selectedGridOption}
          isSmallScreen={isSmallScreen}
          isDarkMode={isDarkMode}
          loginUserData={loginUserData}
          handlePostDetailClick={handlePostDetailClick}
          handleNormalImageClick={handleNormalImageClick}
          handleFavorite={handleFavoriteClick}
          handleShareCount={handleShareCount}
          formatCount={formatCount}
          whatsappMessage={whatsappMessage}
          formatMobileNumber={formatMobileNumber}
          setHideMeDialogShow={setHideMeDialogShow}
          setPostDetails={setPostDetails}
          setIsMarkAsRead={setIsMarkAsRead}
          t={t}
          colorMapping={colorMapping}
          filterValue={filterValue}
          selectedCity={selectedCity}
          handleShareApp={handleShareApp}
          isLoading={isLoading}
          ImageSliderDialog={ImageSliderDialog}
        />
      )}

      {isPremiumAdModalOpen && (
        <PremiumModal
          open={isPremiumAdModalOpen}
          handleClose={() => { setIsPremiumAdModalOpen(false); setIsRespost([]); setEditPostData([]); }}
          premiumAdData={premiumAdData}
          selectedCity={selectedCity}
          isRepost={editPostData}
          handleOk={(resp) => {
            if (resp.success) {
              setIsPremiumAdModalOpen(false);
              dispatch(fetchCardItems({
                isPremiumAd: true,
                isPostClear,
                filterValue,
                selectedCity,
                setFilterValue,
                prevFilterData,
                selectedLanguage,
                searchValue,
                encryptedAdminAuth,
                setIsLoading,
                isRefetch: true,
                setIsRefetch,
                setPremiumAdData
              }));
            }
          }}
        />
      )}
      {AdOptionModalOpen && (
        <AdOptionDialog
          open={AdOptionModalOpen}
          setIsPutAdModalOpen={setIsPutAdModalOpen}
          setIsPremiumAdModalOpen={setIsPremiumAdModalOpen}
          isPutAdModalOpen={isPutAdModalOpen}
          isPremiumAdModalOpen={isPremiumAdModalOpen}
          handleClose={() => {
            setAdOptionModalOpen(false);
            setPremiumAdData({});
            setEditPostData(null);
          }}
          handleOk={() => {
            setAdOptionModalOpen(false);
            setEditPostData(null);
          }}
        />
      )}

       <ShareDialogSelection
        open={selectSharePost}
        onClose={() => setSelectSharePost(false)}
        onShare={handleShare}
      />
    </>
  );
};
export default HomePage;

