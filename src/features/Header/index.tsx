import {
  ArrowDropDownCircleOutlined,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Dialog,
  Drawer,
  Grid,
  IconButton,
  Menu,
  Paper,
  Typography,
} from "@mui/material";
import "../../components/header/HeaderStyles.module.css";
import Button from "@mui/material/Button";
import { Row, Tooltip, message } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { MAIN_COLOR } from "../../config/theme";
import LoginDialog from "../../dialog/LoginDialog";
import PostDetailsDialog from "../../dialog/postDetails/PostDetailDialogContainer";
import ProfileDialog from "../../dialog/profileDialog";
import TransitionDetailDialog from "../../dialog/trasitionDetailDialog";
import { RootState } from "../../redux/reducer";
import {
  findCityFromCoordinatesAPI,
  fireBaseTokenStore,
} from "../../redux/services/common.api";
import {
  generatePDF,
} from "../../redux/services/post.api";
import { CloseDialogComponent } from "../../components/CloseDialogComponent";
import AddFundComponent from "../../components/addFund/AddFundComponent";
import { LayoutContext } from "../../components/layout/LayoutContext";
import headerStyles from "../../components/header/HeaderStyles.module.scss";
import facebookImage from "./../../assets/images/facebook.png";
import instagramImage from "./../../assets/images/instagram.png";
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { SelectChangeEvent } from "@mui/material/Select";
import { fontWeight, maxHeight, maxWidth, styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import {
  getLanguageList,
} from "../../redux/services/setting.api";
import { detectPWAEnvironment, isRunningAsPWA } from "../../utils/pwaUtils";
import {
  DeleteUserSearchHistory,
  GetUserSearchHistory,
  UpdateDesignOption,
  UpdateTheme,
} from "../../redux/services/user.api";
import {
  firebaseConfig,
  GetDesinOption,
  LanguageEnum,
  LOGEVENTCALL,
  logEvents,
} from "../../libs/constant";
import { doLogin, fetchLoginUser, LoginState } from "../../redux/slices/auth";
import SuccessDialog from "../../dialog/SuccessDialog";
import LocationPicker from "../../components/locationpicker/locationpicker";
import { fetchLocationData } from "../../redux/slices/location";
import { fetchCategoryData } from "../../redux/slices/category";
import { areCookiesEnabled, getData, isStorageAvailable, removeItem, storeData } from "../../utils/localstorage";
import { AddAppStatistics } from "../../redux/services/Statistics.api";
import { getFacebookGroupLink } from "../../libs/constant";
import { getDecryptedCookie } from "../../utils/useEncryptedCookies";
import SmoothPopup from "../../dialog/animations/FancyAnimatedDialog";
import { logEffect } from "../../utils/logger";
import AppNotification from "../../components/appnotification/appnotification";
import { LocationLanguageSelector } from './components/locationLanguageSelector';
import { NavigationActions } from './components/navigationActions';
import { UserMenuList } from './components/userMenuList';
import { HeaderMenu } from './functions/headerMenu';
import { NotificationPermissionAccess } from './functions/notificationPermissionAccess';
import { handleChangeLanguage } from './functions/handleChangeLanguage';
import { BouncePopup } from './components/bouncePopUp';
import { SearchSection } from "./components/SearchSection";
import { NavigationLogo } from "./components/NavigationLogo";
import { handleFavClick } from './functions/handleFavClick';
import { fetchSelectedCityById } from './functions/fetchSelectedCityById';
import { MobileSearchBox } from './components/mobileSearchBox';
import { fetchGetDesignOptions } from './functions/fetchGetDesignOptions';
import isEqual from "lodash/isEqual"; // npm install lodash
import { UnorderedListOutlined, AppstoreOutlined } from "@ant-design/icons";
import SearchIcon from '@mui/icons-material/Search';
import { getDatabase, off, onChildAdded, onValue, ref } from "firebase/database";
import { initializeApp } from "firebase/app";
import { chatListReset, fetchchatList, updateChatPreview } from "../../redux/slices/chat";
import { GetMessageCount } from "../../redux/services/chat.api";

interface AnimatedSearchBoxProps {
  open: boolean;
}

const AnimatedSearchBox = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "open",
})<AnimatedSearchBoxProps>(({ open }) => ({
  display: "flex",
  alignItems: "center",
  width: open ? "calc(100% - 30px)" : 0,
  transition: "width 0.3s ease",
  overflow: "hidden",
  marginLeft: "8px",
  padding: open ? "0 8px" : 0,
}));

declare const window: any;
const HeaderPart = () => {
  const {
    doLogout,
    position,
    searchValue,
    setSearchValue,
    filterValue,
    setFilterValue,
    setPrevFilterData,
    prevFilterData,
    setSelectedCity,
    openProfilePopup,
    setIsOpenProfilePopup,
    selectedCity,
    setPostData,
    setIsLoading,
    setIsPostClear,
    setDeferredPrompt,
    setShowInstallButton,
    deferredPrompt,
    showInstallButton,
    setIsSearchOpen,
    isSearchOpen,
    setSelectedLanguage,
    selectedLanguage,
    isLoginLanguageSet,
    setMenuOpenDrawer,
    menuOpenDrawer,
    setIsTransition,
    setSelectedGridOption,
    selectedGridOption,
    selectedCityName,
    setSelectedCityName,
    setIsLanguageChange,
    isLocationApiCall,
    setIsPremiumAd,
    setIsHomeClick,
    setIsDarkMode,
    isDarkMode,
    setIsFeatchCategoryCount,
    isLoading: isPostDataLoading,
    handleMoreMenuNavigate,
    setIsRefetch,
    setTransactionHistoryRefreshKey,
    messageCount,
    setMessageCount
  } = useContext(LayoutContext);
  const facebookLink = selectedCityName ? getFacebookGroupLink(selectedCityName) : "";
  const [{ adminAuth }]: any = useCookies(["adminAuth"]);
  const encryptedAdminAuth = getDecryptedCookie(adminAuth)
  const { data: loginUserData, isLoading } = useSelector(
    (state: RootState) => state.loginUser
  );
  const { data: loginState }: LoginState = useSelector(
    (state: RootState) => state.login
  );
  const { data: cityData } = useSelector((state: RootState) => state.cities);
  const { register, formState, control, setValue, watch } = useForm();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElPolicy, setAnchorElPolicy] = useState<null | HTMLElement>(
    null
  );
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [addFundModalOpen, setIsAddFundModalOpen] = useState(false);
  const [isLocationPicker, setIsLocationPicker] = useState(false);
  const [isAppNotification, setIsAppNotification] = useState(false);
  const [transitionModelPopup, setTransitionModelPopup] = useState(false);
  const [isSelectedPrevLanguage, setSelectedPrevLanguage] = useState(2)
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState([]);
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const watchField = watch();
  const open = Boolean(anchorEl);
  const openPolicyMenu = Boolean(anchorElPolicy);
  const [activeMenuItem, setActiveMenuItem] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLogout, setIsLogOut] = useState(null);
  const [languageList, setLanguageList] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const [successDialog, setSuccessDialog] = useState(false);
  const [isLocationPermissionGiven, setIsLocationPermissionGiven] = useState(false);
  const location = useLocation();
  const [age, setAge] = React.useState("");
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const inputRef = useRef(null);
  const searchHistoryRef = useRef(null);
  const searchHistoryMobileRef = useRef(null);
  const { data: settingData } = useSelector(
    (state: RootState) => state.settingList
  );
  const [slotData, setSlotData] = useState([]);
  const [isSearchHistoryVisible, setIsSearchHistoryVisible] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [youtubeLinkvalue, setYoutubeLink] = useState("");
  const [whatsappLink, setWhatsAppLink] = useState("");
  const [notificationCount, setNotificationCount] = useState("");

  const [YouTubeLinks, setYouTubeLinks] = useState<Record<string, string>>({});
  const [visitedUser, setVisitedUser] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const { data: chatList } = useSelector((state: any) => state.chat);
  
  const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
  };

      const handleChatClick = () => {
          if (loginUserData.data) {
            setIsRefetch(true); setIsPostClear(true); navigate("/chat");  setFilterValue({
              ...filterValue,
              PageNumber: 1 
            });
  
          } else {
            // setLoginModelOpen(true)
          }}

  const isUnregisterUserExist = visitedUser;
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  const [isListening, setIsListening] = useState(false);
  const [currentType, setCurrentType] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [recognitionLang, setRecognitionLang] = useState(null)

  //   const handleNotificationClick = () => {
  //     navigate('/appnotification'); 
  // };
  const isHomePage = (pathname) => {
    const homePages = ["/", "/home", "/BETA/web", "/BETA/web/home"];
    return homePages.includes(pathname) || homePages.includes(pathname.toLowerCase());
  };

  const handleHistoryClick = (historyItem) => {
    setSearchValue(historyItem);
    setIsPostClear(true)
    setIsSearchHistoryVisible(false);
  };

  const handleSearchData = async () => {
    if (loginUserData.data) {
      const response = await GetUserSearchHistory();
      if (response?.success) {
        setSearchHistory(response.data);
        setIsSearchHistoryVisible(true);
      }
    }
  };
  const showPlayStoreIcon = !isRunningAsPWA();

  const handleToggle = () => {
    setIsSearchOpen((prev) => !prev);
    handleSearchData();
  };

  const handleClickAway = (e) => {
    if (searchHistoryRef?.current?.contains(e.target) ||
      searchHistoryMobileRef?.current?.contains(e.target)) {
      return;
    }
    setIsSearchHistoryVisible(false);
  };

  const handleMobileClickAway = () => {
    // setIsSearchOpen(false);
    setIsSearchHistoryVisible(false);
    // setIsSearchOpen(false)
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        //console.log("User accepted the install prompt");
      } else {
        //console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    });
  };

  const deleteSearchHostory = async (historyItem, e) => {
    e.stopPropagation();
    e.preventDefault();
    const response = await DeleteUserSearchHistory(historyItem?.searchtext);

    if (response?.success) {
      setSearchHistory([]);
      // setIsSearchHistoryVisible(true)
      handleSearchData();
      setIsSearchHistoryVisible(true);
    }
  };

  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const menuItems = HeaderMenu({
    setAnchorEl,
    setMenuOpenDrawer,
    setFilterValue,
    filterValue,
    setIsPostClear,
    setIsFeatchCategoryCount,
    handleMoreMenuNavigate,
    setPendingNavigation
  });

  const hideHeaderRoutes = ["/chat"]

  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find((item) =>
      currentPath.includes(item.link || item.mode)
    );
    if (activeItem) {
      setActiveMenuItem(activeItem.id);
    }
  }, [location.pathname, menuItems]);

  useEffect(() => {
    if (!menuOpenDrawer && pendingNavigation) {
      const timer = setTimeout(() => {
        handleMoreMenuNavigate(pendingNavigation);
        setPendingNavigation(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [menuOpenDrawer, pendingNavigation]);

  const handleThemeClick = async () => {
    setIsDarkMode(!isDarkMode)
    if (loginUserData.data) {
      try {
        
        const payload = {
          IsDarkMode: !isDarkMode
        }
        const response = await UpdateTheme(payload)
        if (response.success) {
          dispatch(
            fetchLoginUser({
              Authorization: `Bearer ${encryptedAdminAuth?.user?.token}`,
            })
          );
        }
      } catch (error) {

      }
    }

  }

  const handleShareApp = async (e) => {
    if (!loginUserData?.data) {
      //setIsLoginModalOpen(true);
      //setAnchorEl(null);
      //setMenuOpenDrawer(false);
      if (navigator.canShare) {
        const decodedUrl = "https://adonline.in/";
        const appUrl = "Adonline.in";
  
        navigator
          .share({
            // url: decodedUrl,
            title: t("adOnlineIntroTitle"),
            text: t(`adOnlineIntro`),
          })
        }
      return;
    }
    
    //    //.then(() => console.log("Shared successfully"))
    //    //.catch((error) => console.log("Error sharing:", error));
    //} else {
    //  //console.log("Sharing files is not supported on this browser/device");
    //}
    navigate('/transactionhistory');
    setAnchorEl(null)
    await new Promise((resolve) => {
      setMenuOpenDrawer(false);
      setTimeout(resolve, 50);
    });
  };

  const fetchLocation = async (languageId) => {

    const payload = {
      latitude: "",
      longitude: "",
      LanguageId: languageId
    }
    if (position.latitude && position.longitude) {
      payload.latitude = position.latitude
      payload.longitude = position.longitude
    }
    try {
      dispatch(fetchLocationData(payload))
        .then((res) => {
          if (res) {
            if (!selectedCity) {
              setSelectedCity(res.data.LocationResult[0].id)
            }
            // You can handle the success response here
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          // Handle the error here
        });
    } catch (error) { }
  };
  const typographyStyles = {
    fontSize: "15px",
    fontFamily: "Poppins,sans-serif",
    fontWeight: 400,
    lineHeight: "24px",
    color: "#3C444B",
  };
  const commonMenuStyles = {
    fontSize: "15px",
    fontFamily: "Poppins,sans-serif",
    color: "#3C444B",
    "& .MuiListItemIcon-root": {
      minWidth: "36px",
    },
  };

  const commonAccordionStyles = {
    "&.MuiAccordion-root": {
      border: "none !important",
      boxShadow: "none !important",
    },
    "&.Mui-expanded": {
      margin: "0px !important",
    },
    "&:before": {
      display: "none",
    },
    "& .MuiAccordionSummary-root": {
      "& .MuiTypography-root": {
        ...commonMenuStyles,
      },
    },
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsLogOut(false);
  };
  const handleSearch = (searchValue) => {
    setSearchValue(searchValue);
    setFilterValue({ ...filterValue, Search: searchValue, pageNumber: 1 });
    setIsRefetch(true)
    setIsLoading(true);
  };

  const handleClearInput = () => {
    setSearchValue("");
    setIsPostClear(true);
    setFilterValue({ ...filterValue, PageNumber: 1, Search: "" });
    setIsSearchHistoryVisible(false); // Hide search history when cancel is clicked
  };
  // based on latitude and longitude get citydata api bind
  const getCityName = async (lat, lng) => {
    try {
      const response = await findCityFromCoordinatesAPI(lat, lng);
      setCityName(response.data);
      // setFilterValue({ ...filterValue, PageNumber: 1 ,CityId:selectedCity})
    } catch (error) {
      console.error("Error fetching city name:", error);
    }
  };

  const handleDesignOptionClick = async (id) => {
    if (loginUserData?.data?.length > 0) {
      const response = await UpdateDesignOption(id);
      if (response?.success) {
        setSelectedGridOption(id);
      }
    }
    await storeData("DesignId", id); // Store in local storage
    setSelectedGridOption(id);
  };

  const handleChangeCity = (e) => {
    if (e.label) {
      setSelectedCity(e.value);
      setFilterValue({ ...filterValue, PageNumber: 1, LocationId: e.value });
      // setPostData([]);
      setIsLoading(true);
      window.scrollTo(0, 0);
    }
  };

  const fetchLanguageApi = async () => {
    const response = await getLanguageList();
    if (response) {
      const updatedList = response.data.map((item) => ({
        label: item.nameinlanguage,
        value: item.id,
        initialname: item.initialname,
      }));
      setLanguageList(updatedList);
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    recognition.start();
    setIsListening(true);
    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript((prev) => {
        const updatedTranscript = currentTranscript?.split(".")[0];
        setSearchValue(updatedTranscript);
        setIsPostClear(true)
        return updatedTranscript; // Ensure state is updated
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error: ", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      setCurrentType(null); // Reset current type
    };
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
    setCurrentType(null);
  };

 

  const shoouldHideEntireHeader = hideHeaderRoutes.some(route =>
    location.pathname === route || location.pathname.startsWith(route)
  );

  useEffect(() => {
    if (loginUserData && loginUserData.data) {
    console.log("loginUserData",loginUserData)

      setIsDarkMode(loginUserData?.data[0]?.isdarkmode)
    }
  }, [loginUserData])


  useEffect(() => {
    if (recognition) {
      const recognitionLangvalue = LanguageEnum[i18n?.language?.toUpperCase()] || LanguageEnum.EN;
      recognition.lang = recognitionLang;
      setRecognitionLang(recognitionLangvalue)
    } else {
      console.error("Speech recognition is not supported in this browser.");
    }
  }, [recognition])
  
 const app = initializeApp(firebaseConfig);
    const db: any = getDatabase(app);

        const fetchMessageCount = async() =>{
              const response = await GetMessageCount();
              if(response.success){
                setMessageCount(response?.data[0]?.messagecount || 0)
              }
            }
   
   
useEffect(() => {
    const unsubscribes = [];
    
    if (!chatList?.data || chatList.data.length === 0) return;
    
    const startTime = new Date().toISOString();
    
    chatList?.data?.forEach((elm) => {
        const messagesRef = ref(db, `chats/${elm.chatid}/messages`);
        
        const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
            const newMessage = snapshot.val() as any; // Type assertion
            const chatIdValue = elm?.chatid;
            const msgTime = new Date(newMessage.datetime).toISOString();
            
            if (newMessage && msgTime > startTime) {
                console.log("messageCount", messageCount);
                fetchMessageCount();
            }
        });
        
        unsubscribes.push(() => off(messagesRef));
    });
    
    return () => {
        unsubscribes.forEach((unsub) => unsub());
    };
}, [JSON.stringify(chatList?.data?.map((c) => c.chatid))]);

  useEffect(() => {
    if(loginUserData.data){
  if (location.pathname === "/") {
      dispatch(chatListReset());
    }
    dispatch(fetchchatList());
    }
  
  }, [loginUserData, location.pathname, dispatch]);

  useEffect(() => {
    if (cityData?.length > 0) {
      const convertibleArray = cityData.map((elm) => ({
        label: elm?.label,
        value: elm?.value,
      }));

      // Prepend an object with label and value as null
      const updatedArray = [
        { label: t("General.All"), value: 0 },
        ...convertibleArray,
      ];

      setCities(updatedArray);
    }
  }, [cityData, selectedLanguage, i18n.language]);

  const storeFirebaseToken = async (token: any, id: string) => {
    if (token) {
      const payload = {
        token: token,
        userId: id,
      };
      await fireBaseTokenStore(payload);
    }
  };

  const handleNotificationPermission = async () => {
    await NotificationPermissionAccess({
      loginUserData,
      loginState,
      t
    });
  };
  // calling get city by latitude and logitude api funtion
  useEffect(() => {
    fetchLanguageApi();
  }, []);

  const fetchGetDesignOptions = async () => {
    // const response = await GetDesignOptions();
    // if (response?.success) {
    const updatedOptionList = GetDesinOption.map((option) => {
      const isSelected = option.id === selectedGridOption;
      const icon =
        option.id === 1 ? (
          <UnorderedListOutlined
            className={`font-22 ${isSelected ? "text-primary" : "text-black-500"
              }`}
          />
        ) : (
          <AppstoreOutlined
            className={`font-22 ${isSelected ? "text-primary" : "text-black-500"
              }`}
          />
        );
      return {
        ...option,
        icon,
      };
    });
    setOptionList(updatedOptionList);
    // }
  };

  // useEffect(() => {
  //   const updatedOptionList = fetchGetDesignOptions({ selectedGridOption });

  //   setOptionList((prev) => {
  //     if (!isEqual(prev, updatedOptionList)) {
  //       return updatedOptionList;
  //     }
  //     return prev; // No change, skip state update
  //   });
  // }, [selectedGridOption]);


  useEffect(() => {
    fetchGetDesignOptions()
  }, [selectedGridOption]);


  useEffect(() => {
    let debounceTimer;

    if (searchValue !== undefined && searchValue.trim() !== "") {
      // User started typing, show search history
      setIsSearchHistoryVisible(true);

      if (searchValue.trim().length > 2) {
        debounceTimer = setTimeout(() => {
          setIsPostClear(true)
          handleSearch(searchValue);
          setIsSearchHistoryVisible(false);
          if (LOGEVENTCALL) {
            logEffect(logEvents.User_Search);
          }
        }, 1000);
      }
    } else {
      setIsSearchHistoryVisible(false);
      handleSearch("");
    }

    // Cleanup function that clears the debounce timer
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchValue]);

  useEffect(() => {
    let cityValues;
    if (cities?.length > 0) {
      if (selectedCity || selectedCity === 0) {
        cityValues = cities.find((elm) => elm.value === selectedCity);
      } else if (position?.latitude) {
        cityValues = cities.find((elm) => elm.value === cityName[0]?.id);
      } else if (
        !position?.latitude &&
        loginUserData?.data &&
        loginUserData.data[0]?.cityid !== null
      ) {
        cityValues = cities.find(
          (elm) => elm.value === loginUserData.data[0]?.cityid
        );
      }

      if (cityValues) {
        setValue("city", cityValues);
        setSelectedCity(cityValues?.value ?? cityValues);
      }
    }
  }, [
    cityData,
    cityName,
    loginUserData?.data,
    selectedCity,
    selectedLanguage,
    cities,
  ]);

  const downloadPDF = async (url, name) => {
    try {
      const res = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
    }
  };

  const handleClickExport = async () => {
    const payload = {
      cityId: selectedCity,
      startDate: startDate,
      endDate: endDate,
    };
    const resp = await generatePDF(payload);
    const fileName = resp.substring(resp.lastIndexOf("/") + 1);
    downloadPDF(resp, fileName);
  };

  useEffect(() => {
    if (!openProfilePopup) {
      document.body.classList.remove("profilecity");
    }
  }, [openProfilePopup]);

  useEffect(() => {
    const fetchLanguage = async () => {
      if (languageList?.length > 0) {
        setIsPostClear(true);

        let localStoragelanguageId = await getData("i18nextLng");
        let languageId = localStoragelanguageId || 2;

        const language = languageList.find((elm) => elm.value == languageId);

        if (language) {
          setValue("language", language);
          i18n.changeLanguage(language?.initialname);
          setSelectedLanguage(languageId);
          dispatch(fetchCategoryData({ LanguageId: languageId }));
          setIsLanguageChange(true);
          if (isLoginLanguageSet) {
            setFilterValue((prev) => ({
              ...prev,
              PageNumber: 1,
              LanguageId: languageId,
            }));
          }
        }
      }
    };

    fetchLanguage();
  }, [languageList, loginUserData?.data]);

  useEffect(() => {
    const fetchDesignOption = async () => {
      let designId = await getData("DesignId"); // Retrieve from storage
      designId = designId ? parseInt(designId) : 1; // Default to List View
      setSelectedGridOption(designId);
    };

    fetchDesignOption();
  }, [loginUserData?.data]);

  const handleLanguageChange = (value) => {
    handleChangeLanguage({
      value,
      i18n,
      setIsTransition,
      setSelectedLanguage,
      setIsPostClear,
      setTransactionHistoryRefreshKey,
      dispatch,
      fetchLocation,
      fetchSelectedCityById,
      filterValue,
      setFilterValue,
      LOGEVENTCALL,
      setIsRefetch
    });
  };

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchHistoryRef?.current &&
        !searchHistoryRef?.current?.contains(e.target)
      ) {
        setIsSearchHistoryVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchHistoryRef]);

  useEffect(() => {
    const selectedLanguageData = languageList.find(
      (elm) => elm.value === selectedLanguage
    );
    if (selectedLanguageData) {
      setValue("language", selectedLanguageData);
    }
    const visiteduserFeatch = async () => {
      const visiteduserData = await getData("visitedUser")
      setVisitedUser(visiteduserData)
    }
    visiteduserFeatch()
  }, []);


  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      if (isAppNotification && event.state && event.state.dialogOpen) {
        setIsAppNotification(false);
      }
    };

    if (isAppNotification) {
      window.history.pushState(null, "");
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isAppNotification]);

  useEffect(() => {
    const init = async () => {
      const { isPWAInstalled, platform } = await detectPWAEnvironment();
      if (isPWAInstalled && platform === "Android") return;  
  
      const checkNotificationPermission = async () => {
        const permissionStatus = await getData("notificationPermission");
  
        if (Notification.permission === "granted") {
          if (permissionStatus !== "granted") {
            await storeData("notificationPermission", "granted");
          }
          setIsLocationPermissionGiven(true);
          return;
        }
  
        if (Notification.permission === "denied") {
          await storeData("notificationPermission", "denied");
          setIsLocationPermissionGiven(false);
          return;
        }
  
        if (Notification.permission === "default") {
          await storeData("notificationPermission", "default");
          setIsLocationPermissionGiven(false);
        }
      };
  
      await checkNotificationPermission();
  
      // Use navigator.permissions.query to listen for changes
      let permissionRef: PermissionStatus | null = null;
  
      try {
        permissionRef = await navigator.permissions.query({ name: "notifications" as PermissionName });
        const listener = () => checkNotificationPermission();
        permissionRef.addEventListener("change", listener);
  
        // Cleanup
        return () => {
          permissionRef?.removeEventListener("change", listener);
        };
      } catch (error) {
        console.error("Permission API not supported:", error);
      }
    };
  
    init();
  }, []);
  
  useEffect(() => {
    const links: Record<string, string> = {};
    settingData?.data?.forEach((item) => {
      if (item.name.startsWith("youtubeUrl_")) {
        // Extract the language code (e.g., EN, GU, HI)
        const languageCode = item.name.split("_")[1].toLowerCase();
        links[languageCode] = item.value;
      }
    });
    const whatsappSetting = settingData?.data?.find(
      (item) => item.name === "whatsappGroupURL"
    );
    if (whatsappSetting) {
      setWhatsAppLink(whatsappSetting.value);
    }

    const isNotification = settingData?.data?.find(
      (item) => item.name === "NotificationCount"
    );
    if (isNotification) {
      setNotificationCount(isNotification.value); // Update state with the URL
    }

    setYouTubeLinks(links); // Update state once after the loop
  }, [settingData]);

  const LanguageMap: Record<number, string> = {
    1: "en",
    2: "gu",
    3: "hi",
  };

  const languageCode = LanguageMap[selectedLanguage as number] || "en";
  const youtubeLink = YouTubeLinks[languageCode] || YouTubeLinks["en"];

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [isDarkMode])

  useEffect(() => {
    if (i18n.isInitialized && selectedLanguage && !selectedCity && visitedUser?.locationId) {
      setSelectedCity(visitedUser.locationId);
    }
  }, [i18n.isInitialized, selectedLanguage, visitedUser]);


  useEffect(() => {
    if (i18n.isInitialized && selectedLanguage && selectedCity) {
      fetchSelectedCityById({
        selectedLanguage,
        selectedCity,
        setSelectedCityName
      });
    }
  }, [selectedCity, selectedLanguage, i18n.isInitialized]);

  useEffect(() => {
    const fetchActivityTrck = async () => {
      const activityTrack = await getData("activityTrack");
      const UA = navigator.userAgent;
      const IOS = UA.match(/iPhone|iPad|iPod/);
      const ANDROID = UA.match(/Android/);
      const PLATFORM = IOS ? "IOS" : ANDROID ? "Android" : "unknown";
      const standalone = window.matchMedia("(display-mode: standalone)").matches;
      const INSTALLED = !!(standalone || (IOS && !UA.match(/Safari/)));
      const visiteduserData = await getData("visitedUser");

      const payload = {
        userId: loginUserData?.data?.[0]?.id || visiteduserData?.id,
        Platform: PLATFORM,
        LocationId: selectedCity || 19038,
      };

      if (INSTALLED && !activityTrack && selectedCity ) {

        await AddAppStatistics(payload);
        await storeData("activityTrack", "true");
      }
    };

    fetchActivityTrck(); // Call only when loginUserData is available
  }, [loginUserData]);

  const count = 1000;

  return (
    <div className={`${headerStyles.headerContainer} headerContainer ${shoouldHideEntireHeader ? "d-none" : ""}`}>
      <Grid container alignItems="center" justifyContent="space-between">
        <div className={`d-flex align-items-center justify-content-between w-100 ${headerStyles.logosection}`}>
          <NavigationLogo
            setIsPremiumAd={setIsPremiumAd}
            setFilterValue={setFilterValue}
            setIsFeatchCategoryCount={setIsFeatchCategoryCount}
            setIsPostClear={setIsPostClear}
            setIsLoading={setIsLoading}
            searchValue={searchValue}
            selectedCity={selectedCity}
            handleMoreMenuNavigate={handleMoreMenuNavigate}
          />
          <Grid
            justifyContent="flex-end"
            className="d-flex align-items-center w-xs-100 justify-content-end w-100"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="responsive-flex cursor-pointer d-flex align-items-center justify-content-center"
            >
              <WhatsAppIcon className="text-green font-24" />
              <p className="text-sm text-black font-medium mt-1 mt-0 mb-0 ml-5">
                {t("General.Join Group")}
              </p>
            </a>

            <a
              href="https://www.facebook.com/people/AdOnline-Weekly-Ads/61578654893096/"
              target="_blank"
              rel="noopener noreferrer"
              className="responsive-flex cursor-pointer d-flex align-items-center justify-content-center ml-10"
            >
              <FacebookIcon className="text-green font-24" style={{ fill: "#1877F2" }} />
              <p className="text-sm text-black font-medium mt-1 mt-0 mb-0 ml-5">
                {t("General.Join Group")}
              </p>
            </a>
            <LocationLanguageSelector
              selectedCityName={selectedCityName}
              setIsLocationPicker={setIsLocationPicker}
              register={register}
              formState={formState}
              control={control}
              languageList={languageList}
              handleChangeLanguage={handleLanguageChange}
            />
          </Grid>
          <div className="d-flex justify-content-end align-items-center d-none d-xs-flex header-ddl">
          </div>
          <Grid className="d-flex login-btn-position ml-20">
            {!encryptedAdminAuth?.user?.token && (
              <>
                <Button
                  color="inherit"
                  className="text-capitalize bg-primary text-white d-xs-none ml-5"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  {t("General.Login")}
                </Button>
              </>
            )}
            {!encryptedAdminAuth?.user?.token && (
              <div className="d-flex justify-content-center align-items-center ml-10 d-xs-none">
                <MenuIcon
                  onClick={() => setMenuOpenDrawer(true)}
                  className="cursor-pointer"
                />
              </div>
            )}

            {loginUserData?.data && loginUserData?.data?.length > 0 && (
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? "user-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                className="dropdownSvgColor d-xs-none "
              >
                <Typography color={MAIN_COLOR}>
                  <p>{t("General.Menu")}</p>
                </Typography>
                <ArrowDropDownCircleOutlined
                  fontSize="small"
                  sx={{ pl: "5px" }}
                />
              </IconButton>
            )}
          </Grid>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <UserMenuList
              loginUserData={loginUserData}
              setIsLoginModalOpen={setIsLoginModalOpen}
              setMenuOpenDrawer={setMenuOpenDrawer}
              setAnchorEl={setAnchorEl}
              handleMoreMenuNavigate={handleMoreMenuNavigate}
              setIsOpenProfilePopup={setIsOpenProfilePopup}
              setIsAddFundModalOpen={setIsAddFundModalOpen}
              setIsLogOut={setIsLogOut}
              register={register}
              formState={formState}
              control={control}
              languageList={languageList}
              handleChangeLanguage={handleLanguageChange}
              t={t}
              isDarkMode={isDarkMode}
              handleShareApp={handleShareApp}
              instagramImage={instagramImage}
              facebookImage={facebookImage}
              YouTubeIcon={YouTubeIcon}
              isIOS={isIOS}
              isAndroid={isAndroid}
              setFilterValue={setFilterValue}
              filterValue={filterValue}
              setIsFeatchCategoryCount={setIsFeatchCategoryCount}
              HeaderMenu={menuItems}
              setPendingNavigation={setPendingNavigation}
              selectedLanguage={selectedLanguage}
              setIsRefetch={setIsRefetch}
            />
          </Menu>
          <Drawer
            anchor="right"
            open={menuOpenDrawer}
            onClose={() => setMenuOpenDrawer(false)}
            sx={{
              "& .-": {
                width: "255px",
              },
            }}
          >
            <>
              <div>
                <CloseDialogComponent
                  handleClose={() => setMenuOpenDrawer(false)}
                />
              </div>
              <UserMenuList
                loginUserData={loginUserData}
                setIsLoginModalOpen={setIsLoginModalOpen}
                setMenuOpenDrawer={setMenuOpenDrawer}
                setAnchorEl={setAnchorEl}
                handleMoreMenuNavigate={handleMoreMenuNavigate}
                setIsOpenProfilePopup={setIsOpenProfilePopup}
                setIsAddFundModalOpen={setIsAddFundModalOpen}
                setIsLogOut={setIsLogOut}
                register={register}
                formState={formState}
                control={control}
                languageList={languageList}
                handleChangeLanguage={handleLanguageChange}
                t={t}
                isDarkMode={isDarkMode}
                handleShareApp={handleShareApp}
                instagramImage={instagramImage}
                facebookImage={facebookImage}
                YouTubeIcon={YouTubeIcon}
                isIOS={isIOS}
                isAndroid={isAndroid}
                setFilterValue={setFilterValue}
                filterValue={filterValue}
                setIsFeatchCategoryCount={setIsFeatchCategoryCount}
                HeaderMenu={menuItems}
                setPendingNavigation={setPendingNavigation}
                selectedLanguage={selectedLanguage}
                setIsRefetch={setIsRefetch}
              />
            </>
          </Drawer>
        </div>
        <div className="w-100 d-flex justify-content-between mb-5 search-box">
          <NavigationActions
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            setIsPostClear={setIsPostClear}
            handleFavClick={() => handleFavClick({
              loginUserData,
              setIsPostClear,
              setFilterValue,
              filterValue,
              selectedLanguage,
              setIsPremiumAd,
              setIsHomeClick,
              setIsLoading,
              setPostData,
              navigate,
              setIsLoginModalOpen,
              dispatch,
              selectedCity,
              prevFilterData,
              searchValue,
              encryptedAdminAuth
            })}
            loginUserData={loginUserData}
            setIsPremiumAd={setIsPremiumAd}
            selectedLanguage={selectedLanguage}
            setPostData={setPostData}
            navigate={navigate}
            setIsLoginModalOpen={setIsLoginModalOpen}
            selectedCityName={selectedCityName}
            setIsLocationPicker={setIsLocationPicker}
          />
          <div className="d-flex align-items-center mobile-header-scroll">
            {/* Mobile search toggle icon, visible only on mobile */}
            {isHomePage(location.pathname) && (
              <IconButton
                onClick={handleToggle}
                className={`pl-0 pr-0  dnd-none ${isSearchOpen ? "search-icon-active" : ""}`}
              >
                <SearchIcon
                  className={"pt-6"}
                  style={{
                    fill: isSearchOpen
                      ? "#ff780c"
                      : isDarkMode
                        ? "#cfcfcf"
                        : "#8f959e"
                  }}
                />
              </IconButton>
            )}

            <SearchSection
              isSearchOpen={isSearchOpen}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              handleSearch={handleSearch}
              handleClearInput={handleClearInput}
              handleSearchData={handleSearchData}
              isPostDataLoading={isPostDataLoading}
              isSearchHistoryVisible={isSearchHistoryVisible}
              searchHistory={searchHistory}
              handleHistoryClick={handleHistoryClick}
              deleteSearchHostory={deleteSearchHostory}
              handleClickAway={handleClickAway}
              isListening={isListening}
              startListening={startListening}
              stopListening={stopListening}
              isDarkMode={isDarkMode}
              location={location}
              inputRef={inputRef}
              searchHistoryRef={searchHistoryRef}
              searchHistoryMobileRef={searchHistoryMobileRef}
              filterValue={filterValue}
              setIsPostClear={setIsPostClear}
              setIsLoading={setIsLoading}
              notificationCount={notificationCount}
              isLocationPermissionGiven={isLocationPermissionGiven}
              NotificationPermissionAccess={handleNotificationPermission}
              setIsAppNotification={setIsAppNotification}
              handleThemeClick={handleThemeClick}
              youtubeLink={youtubeLink}
              selectedGridOption={selectedGridOption}
              handleDesignOptionClick={handleDesignOptionClick}
              tooltipVisible={tooltipVisible}
              setTooltipVisible={setTooltipVisible}
              messageCount={messageCount}
              handleChatClick={handleChatClick}
              setIsLoginModalOpen={setIsLoginModalOpen}
            />
          </div>
        </div>
        <MobileSearchBox
          location={location}
          setIsLoading={setIsLoading}
          isSearchOpen={isSearchOpen}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleSearchData={handleSearchData}
          isPostDataLoading={isPostDataLoading}
          handleClearInput={handleClearInput}
          isSearchHistoryVisible={isSearchHistoryVisible}
          searchHistory={searchHistory}
          handleHistoryClick={handleHistoryClick}
          deleteSearchHostory={deleteSearchHostory}
          handleClickAway={handleClickAway}
          isListening={isListening}
          startListening={startListening}
          stopListening={stopListening}
          isDarkMode={isDarkMode}
          handleToggle={handleToggle}
          inputRef={inputRef}
          searchHistoryRef={searchHistoryRef}
          searchHistoryMobileRef={searchHistoryMobileRef}
          filterValue={filterValue}
          setIsPostClear={setIsPostClear}
          isIOS={/iPad|iPhone|ipod/.test(navigator.userAgent) && !window.MSStream}
        />
        <div
          className="live-stats-ticker"
          style={{ fontSize: isIOS ? "10px" : "16px" }}
        >
          <div className="ticker-wrapper">
          {Array.from({ length: Math.ceil(window.innerWidth / 400) + 2 }).map((_, idx) => (
            <div className="ticker-content" key={idx}>
              ⬇️ 50k+ {t("General.livebar.downloads")}
              <span className="divider">|</span>
              🚀 {t("General.livebar.growth")}
              <span className="divider">|</span>
              4.7⭐ {t("General.livebar.rating")}
            </div>
          ))}
          </div>
          
        </div>
      </Grid>
      {isAddPostModalOpen && (
        <PostDetailsDialog
          {...{
            open: isAddPostModalOpen,
            handleClose: () => {
              setIsAddPostModalOpen(false);
            },
          }}
        />
      )}
      {isLoginModalOpen && (
        <LoginDialog
          {...{
            open: isLoginModalOpen,
            handleClose: (event, reason) => {
              if (reason && reason === "backdropClick") return;
              setIsLoginModalOpen(false);
            },
            handleOk: (res) => {
              setIsLoginModalOpen(false);
              if (
                res &&
                (res?.data?.firstName === "" ||
                  (loginUserData?.data?.length > 0 &&
                    loginUserData?.data[0]?.cityid))
              ) {
                setIsOpenProfilePopup(true);
              }
            },
          }}
        />
      )}
      {addFundModalOpen && (
        <Dialog
          onClose={() => setIsAddFundModalOpen(false)}
          sx={{ m: "0px" }}
          open={addFundModalOpen}
          maxWidth="xs"
          fullWidth
        >
          <AddFundComponent handleOk={(resp) => setIsAddFundModalOpen(false)} />
        </Dialog>
      )}

      {isLocationPicker && (
        <div>

          <SmoothPopup
            onClose={() => setIsLocationPicker(false)}
            open={isLocationPicker}
            fullWidth
            PaperProps={{
              className: "w-100 imageslidewidth",
            }}
            title="Product Details"
          >
            <LocationPicker
              setIsLocationPicker={setIsLocationPicker}
              lattitude={position?.latitude}
              longitude={position?.longitude}
              languageId={selectedLanguage}
              isSeprateLocation={false}
            />
          </SmoothPopup>
        </div>
      )}

      {isAppNotification && (
        <div>
          <SmoothPopup
            onClose={() => setIsAppNotification(false)}
            open={isAppNotification}
            className="putaddialog"
            fullWidth
            PaperProps={{
              className: "w-100 imageslidewidth",
            }}
            title="App Notification"
          >
            <AppNotification
              setIsAppNotification={setIsAppNotification}
              isAppNotification={isAppNotification}
            />
          </SmoothPopup>
        </div>
      )}

      {transitionModelPopup && (
        <TransitionDetailDialog
          {...{
            open: transitionModelPopup,
            onClose: () => setTransitionModelPopup(false),
          }}
        />
      )}
      {openProfilePopup && (
        <ProfileDialog
          {...{
            open: openProfilePopup,
            cities: cityData,
            cityName: cityName,
            handleClose: () => {
              setIsOpenProfilePopup(false);
            },
            handleOk: () => {
              setIsOpenProfilePopup(false);
            },
          }}
        />
      )}

      <BouncePopup
        open={isLogout}
        onClose={handleClose}
        title={t("General.Confirmation")}
        content={t("General.Do you really want to log out ?")}
        onConfirm={() => {
          doLogout();
          handleClose();
        }}
        confirmText={t("General.Yes")}
        cancelText={t("General.No")}
        isDarkMode={isDarkMode}
      />

      {
        <SuccessDialog
          open={successDialog}
          handleClose={() => setSuccessDialog(false)}
        />
      }
    </div>
  );
};
export default HeaderPart;
