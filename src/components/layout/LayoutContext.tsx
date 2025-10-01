import { message } from "antd";
import { AxiosInstance } from "axios";
import "firebase/analytics";
import Cookies from "js-cookie";
import React, { createContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setupNotifications } from "../../firebase";
import { COOKIES_EXPIRE_TIME, firebaseConfig, FRONTEND_VERSION, LOGEVENTCALL, logEvents, LoginMethod, NAVIGATION_LINKS } from "../../libs/constant";
import { useLocalStorage } from "../../libs/customHooks/useLocalStorage";
import { API } from "../../libs/helper";
import { RootState } from "../../redux/reducer";
import { fireBaseTokenStore } from "../../redux/services/common.api";
import { getLocationById, SaveLocationHistory } from "../../redux/services/locations.api";
import {
  doLogin,
  fetchLoginUser,
  loginReset,
  LoginState,
  loginUserReset
} from "../../redux/slices/auth";
import { fetchLocationData } from "../../redux/slices/location";
import { fetchSettingData } from "../../redux/slices/setting";
import { getData, removeItem, storeData } from "../../utils/localstorage";
import { logEffect } from "../../utils/logger";
import { getSessionData, storeSessionData } from "../../utils/sessionStorage";
import { getDecryptedCookie, setEncryptedCookie } from "../../utils/useEncryptedCookies";
import { selectTotalRecords } from "../../redux/slices/postSlice";
import { ReadInAppNotifications } from "../../redux/services/notification";
import useAvailableSlots from "../../features/Home/hooks/useAvailableSlots";
import { detectPWAEnvironment } from "../../utils/pwaUtils";
import { GetMessageCount } from "../../redux/services/chat.api";
import { getDatabase, off, onChildAdded, ref } from "firebase/database";
import { chatListReset, fetchchatList, updateChatPreview } from "../../redux/slices/chat";
import { initializeApp } from "firebase/app";
import { DeviceUUID } from "device-uuid";

interface LayoutContextModel {
  doLogout?: () => void;
  setFilterValue?: any;
  filterValue?: any;
  initialFilter?: any;
  selectedCity?: any;
  searchValue?: string;
  openProfilePopup?: boolean;
  setPosition?: (d: any) => void;
  setSelectedCity?: (d: any) => void;
  setSearchValue?: (d: any) => void;
  setIsOpenProfilePopup?: (d: boolean) => void;
  position?: { latitude: null | string; longitude: null | string };
  postData?: any;
  setPostData?: any;
  categoryList?: any;
  isLoading?: any;
  setIsLoading?: any;
  SHOW_WHATSAPP_OTP_OPTION?: boolean;
  setIsPostClear?: (d: boolean) => void;
  isPostClear?: boolean;
  prevFilterData?: any;
  premiumPostData?: any;
  setPremiumPostData?: any;
  setIsHomeClick?: any;
  isHomeClick?: boolean;
  setPrevFilterData?: any;
  showInstallButton?: boolean;
  deferredPrompt?: any;
  setShowInstallButton: any;
  setDeferredPrompt: any;
  setIsSearchOpen?: any;
  isSearchOpen?: boolean;
  setSelectedLanguage?: any;
  selectedLanguage?: any;
  setIsLoginLanguageSet?: any;
  isLoginLanguageSet?: boolean;
  setMenuOpenDrawer: (d: boolean) => void;
  menuOpenDrawer?: any;
  setIsTransition?: any;
  isTransition?: boolean;
  selectedGridOption?: any;
  setSelectedGridOption?: any;
  setAdOptionModalOpen?: any;
  AdOptionModalOpen?: boolean;
  defaultMessageType?: string;
  isPremiumAd?: boolean;
  setIsPremiumAd?: any;
  selectedCityName?: any;
  setSelectedCityName?: any,
  setIsLanguageChange?: any,
  isLanguageChage?: any,
  setIsLocationApiCall?: any,
  isLocationApiCall?: any,
  slotData?: any,
  setIsDarkMode?: any,
  isDarkMode?: any
  setIsFeatchCategoryCount?: any,
  isFeatchCategoryCount?: any
  activeTab?: number;
  setActiveTab?: (d: number) => void;
  handleMoreMenuNavigate?: (route: string) => void;
  updatePostCounts?: (postId: number, data: any) => void;
  setIsRefetch?: any,
  isRefetch?: any,
  setIsScrooling: any,
  isScrolling: boolean,
  refetch?:any,
  transactionHistoryRefreshKey?: boolean;
  setTransactionHistoryRefreshKey?: any;
  setShouldHideBottomNavigation?: (d: boolean) => void;
  shouldHideBottomNavigation?: boolean,
  setMessageCount?:any,
  messageCount?:any
}
declare global {
  interface Window {
    receiveDeviceToken?: (token: string) => void;
    webkit?: {
      messageHandlers?: {
        [key: string]: {
          postMessage: (msg: any) => void;
        };
      };
    };
  }
}
const initialState: LayoutContextModel = {
  setPosition: () => { },
  doLogout: () => { },
  setFilterValue: () => { },
  filterValue: () => { },
  position: { latitude: null, longitude: null },
  initialFilter: {},
  selectedCity: {},
  openProfilePopup: false,
  searchValue: "",
  setSelectedCity: () => { },
  setSearchValue: () => { },
  setIsOpenProfilePopup: () => { },
  postData: {},
  categoryList: {},
  premiumPostData: {},
  isLoading: {},
  setIsLoading: () => { },
  setPostData: () => { },
  setPremiumPostData: () => { },
  SHOW_WHATSAPP_OTP_OPTION: false,
  defaultMessageType: "Whatsapp",
  setIsPostClear: () => { },
  isPostClear: false,
  prevFilterData: {},
  setIsHomeClick: () => { },
  isHomeClick: true,
  setPrevFilterData: () => { },
  showInstallButton: false,
  deferredPrompt: null,
  setDeferredPrompt: () => { },
  setShowInstallButton: () => { },
  setIsSearchOpen: () => { },
  isSearchOpen: false,
  selectedLanguage: 2,
  setSelectedLanguage: () => { },
  setIsLoginLanguageSet: () => { },
  isLoginLanguageSet: false,
  setMenuOpenDrawer: () => { },
  menuOpenDrawer: false,
  setIsTransition: () => { },
  isTransition: false,
  selectedGridOption: 1,
  setSelectedGridOption: () => { },
  setAdOptionModalOpen: () => { },
  AdOptionModalOpen: false,
  isPremiumAd: false,
  setIsPremiumAd: () => { },
  setSelectedCityName: () => { },
  selectedCityName: "",
  setIsLanguageChange: () => { },
  isLanguageChage: false,
  setIsLocationApiCall: () => { },
  isLocationApiCall: false,
  slotData: [],
  setIsDarkMode: () => { },
  isDarkMode: false,
  setIsFeatchCategoryCount: () => { },
  isFeatchCategoryCount: true,
  activeTab: 1,
  setActiveTab: () => { },
  handleMoreMenuNavigate: () => { },
  updatePostCounts: () => { },
  setIsRefetch: () => { },
  isRefetch: true,
  setIsScrooling: () => { },
  isScrolling: false,
  transactionHistoryRefreshKey: false,
  setTransactionHistoryRefreshKey: () => { },
  setShouldHideBottomNavigation: () => { },
  shouldHideBottomNavigation: false,
  refetch:false,
  setMessageCount:() => { },
  messageCount:0
};

export const LayoutContext = createContext(initialState);

const LayoutContextProvider = ({ children }: any) => {
  const [{ adminAuth }, removeCookie]: any = useCookies(["adminAuth"]);
  const encryptedAdminAuth = getDecryptedCookie(adminAuth)
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const isLocationFetched = useRef(false);
  // const [selectedCity, setSelectedCity] = useState("");
  const [openProfilePopup, setIsOpenProfilePopup] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { data: loginUserData } = useSelector(
    (state: RootState) => state.loginUser
  );
  const { data: categoryList } = useSelector(
    (state: RootState) => state.categoryList
  );


  const [selectedCity, setSelectedCity] = useLocalStorage(
    "selectedCity",
    loginUserData?.data?.[0]?.locationid ?? 0
  );
  
  const totalRecords = useSelector(selectTotalRecords);
  const [isLoading, setIsLoading] = useState(true);
  const [postData, setPostData] = useState([]);
  const [premiumPostData, setPremiumPostData] = useState([]);
  const [SHOW_WHATSAPP_OTP_OPTION, SET_SHOW_WHATSAPP_OTP_OPTION] =
    useState(false);
  const { data: settingData } = useSelector((state: RootState) => state.settingList);
  const { slotData, refetch } = useAvailableSlots(true, loginUserData);
  
  const [defaultMessageType, setDefaultMessageType] = useState("Whatsapp");
  const [isPostClear, setIsPostClear] = useState(true);
  const [isHomeClick, setIsHomeClick] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(2);
  const [isLanguageChage, setIsLanguageChange] = useState(false);
  const [isLoginLanguageSet, setIsLoginLanguageSet] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const [menuOpenDrawer, setMenuOpenDrawer] = useState(false);
  const [selectedCityName, setSelectedCityName] = useLocalStorage("selectedCityName");
  const [isTransition, setIsTransition] = useState(false);
  const [selectedGridOption, setSelectedGridOption] = useState(1);
  const [filterValue, setFilterValue] = useState(null);
  const [prevFilterData, setPrevFilterData] = useState(null);
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const [AdOptionModalOpen, setAdOptionModalOpen] = useState(false);
  const [isPremiumAd, setIsPremiumAd] = useState(false);
  const [isLocationApiCall, setIsLocationApiCall] = useState(true);
  const [isLocationPermissionGiven, setIsLocationPermissionGiven] = useState(false);
  const [isDarkMode, setIsDarkMode] = useLocalStorage("false");
  const [isFeatchCategoryCount, setIsFeatchCategoryCount] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [isRefetch, setIsRefetch] = useState(false)
  const [isScrolling, setIsScrooling] = useState(false)
  const [transactionHistoryRefreshKey, setTransactionHistoryRefreshKey] = useState(false);
  const [shouldHideBottomNavigation, setShouldHideBottomNavigation] = useState(false);




  // const {t} = useTranslation()
  const { data: loginState }: LoginState = useSelector(
    (state: RootState) => state.login
  );

  const doLogout = async (noApiCall = false) => {
    if (noApiCall) {
      dispatch(loginReset());
      dispatch(loginUserReset());
    }
    Cookies.remove("adminAuth");
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  const updateCookieExpiration = async () => {
    const currentDate = new Date();
    if (encryptedAdminAuth?.session?.expireAt) {
      if (new Date(encryptedAdminAuth?.session?.expireAt).getTime() > currentDate.getTime()) {
        await setEncryptedCookie("adminAuth", {
          ...encryptedAdminAuth,
          session: { expireAt: COOKIES_EXPIRE_TIME.toISOString() },
        }, { expires: new Date(COOKIES_EXPIRE_TIME) });
      } else {
        doLogout();
      }
    }
  };


  useEffect(() => {
    const clearOnFirstPWAInstall = async () => {
        const { isPWAInstalled, platform } = await detectPWAEnvironment();
        if (!isPWAInstalled || platform !== "Android") return;
      
        const url = new URL(window.location.href);
        const installId = url.searchParams.get("installId");


        if (!installId) return;

        const savedInstallId = await getData("installId");
        if (savedInstallId !== installId) {
            try {
                await removeItem("installId")
                sessionStorage.clear();

                // Clear IndexedDB databases
                if (window.indexedDB && typeof (indexedDB as any).databases === "function") {
                    const dbs = await (indexedDB as any).databases();
                    await Promise.all(
                        dbs.map((db: any) =>
                            db?.name
                                ? new Promise<void>((resolve) => {
                                    const req = indexedDB.deleteDatabase(db.name);
                                    req.onsuccess = req.onerror = req.onblocked = () => resolve();
                                })
                                : Promise.resolve()
                        )
                    );
                }
                if ("caches" in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map((k) => caches.delete(k)));
                }
            } catch (e) {
                console.error("❌ Failed clearing app data:", e);
            }

            
            await storeData("installId", installId);
        }

        // Remove installId from URL so it doesn’t leak
        url.searchParams.delete("installId");
        window.history.replaceState({}, "", url.toString());
    };

    clearOnFirstPWAInstall();
}, []);

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
        .then(async (res) => {
          if (res) {
            if (!selectedCity) {
              setSelectedCity(res.data.LocationResult[0].id)
            }
            if (position.latitude && position.longitude) {
              await storeData(
                "currentUserLocation",
                JSON.stringify({
                  id: res.data.LocationResult[0].id,
                  name: res.data.LocationResult[0].name,
                  latitude: position.latitude,
                  longitude: position.longitude
                })
              );
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

  const fetchSelectedCityById = async (language?: any) => {
    try {

      // Ensure selectedLanguage and selectedCity are available
      if (selectedLanguage && selectedCity) {
        const payload = {
          LanguageId: language ?? selectedLanguage, // Use provided language or fallback to selectedLanguage
          LocationId: selectedCity, // The selected city ID
        };

        // Fetch city data
        const response = await getLocationById(payload);

        if (response?.success) {
          setSelectedCityName(response.data[0].name); // Update city name on successful response
          const visiteduserData = await getData("visitedUser")

          if (selectedCity) {
            const payload = {
              LocationId: selectedCity,
              UnregisteredUserId: visiteduserData?.id || null
            }
            SaveLocationHistory(payload)
          }

        }
      }
    } catch (error) {
      console.error("Error fetching selected city:", error);
      // Handle errors as needed
    }
  };

  const fetchLogin = async () => {
    try {
      const visiteduserData = await getData("visitedUser")
      if (
        !visiteduserData?.id
      ) {
        const payload = {
          MobileNo: null,
          IsMobile: true,
          ISWhatsapp: true,
          LanguageId: await getData("i18nextLng") || 2,
          DesignId: await getData("DesignId") || 1,
          LocationId: selectedCity,
          UserId: visiteduserData?.id,
          // DeviceId: new DeviceUUID().get(),
          demoToOriginal: false,
        };

        dispatch(doLogin(payload, LoginMethod.userVisit));
      }
    } catch (e) {
      message.error(e.message);
    }
  }

  const isStorageAvailable = async () => {
    try {
      await storeData("test", "1");
      await storeData("test");
      document.cookie = "test=1; path=/";
      return document.cookie.includes("test=");
    } catch (error) {
      return false;
    }
  };

   useEffect(() => {
      const fetchMessageCount = async() =>{
        const response = await GetMessageCount();
        if(response.success){
          setMessageCount(response?.data[0]?.messagecount)
  
        }
      }
      if(loginUserData?.data){
      fetchMessageCount()
      }
    }, [loginUserData]);
  
     
   


  const fetchInitialData = async () => {
    const intialState = {
      UserId: 0,
      Search: searchValue,
      LocationId: selectedCity || 0,
      Favorites: false,
      PageSize: 50,
      PageNumber: 1,
      TagIds: "",
      Frequency: 0,
      CategoryId: "",
      SubCategoryId: "",
      IsPost: true,
      IsPremiumAd: true,
      LanguageId: await getData("i18nextLng") || 2,
    }

    setPrevFilterData(intialState)
    setFilterValue(intialState)
  }

  const updatePostCounts = (postId, updatedCounts) => {
    setPostData((prevData) =>
      prevData.map((post) =>
        post.id === postId ? { ...post, ...updatedCounts } : post
      )
    );
  };

  const handleGetOtpOptions = () => {
    try {
      // Assuming `settings` is your provided array
      const otpSettings = settingData?.data?.filter((item) =>
        ["IsWhatsappService", "IsSmsIdeaService"].includes(item.name)
      );

      if (otpSettings?.length === 2) {
        const isWhatsappEnabled = otpSettings.find(
          (item) => item.name === "IsWhatsappService"
        )?.value === "1";
        const isSmsEnabled = otpSettings.find(
          (item) => item.name === "IsSmsIdeaService"
        )?.value === "1";

        SET_SHOW_WHATSAPP_OTP_OPTION(isWhatsappEnabled && isSmsEnabled);

        if (!isWhatsappEnabled && isSmsEnabled) {
          setDefaultMessageType("sms");
        }
      }
    } catch (error) {
      console.error("Error processing OTP options", error);
    }
  };

  var navigator_info = window.navigator;
  var screen_info = window.screen;
  var uid: any = navigator_info.mimeTypes.length;
  uid += navigator_info.userAgent.replace(/\D+/g, "");
  uid += navigator_info.plugins.length;
  uid += screen_info.height || "";
  uid += screen_info.width || "";
  uid += screen_info.pixelDepth || "";

  const storeFirebaseToken = async (token: any, id: string) => {
    if (token) {
      const payload = {
        token: token,
        userId: id,
      };
      await fireBaseTokenStore(payload);
    }
  };

  const axiosInstance: AxiosInstance = API();
  axiosInstance.interceptors.request.use(
    (c: any) => {
      if (encryptedAdminAuth && encryptedAdminAuth?.user?.token) {
        c.headers["Authorization"] = `Bearer ${encryptedAdminAuth?.user?.token}`;
      }
      if (c.url?.trim() !== "" && c.method === 'get') {
        const version = FRONTEND_VERSION;
        const hasQueryParams = c.url?.includes('?');
        const hasVersionParam = c.url?.includes('version');
        if (hasQueryParams && !hasVersionParam) {
          c.url = `${c.url}&version=${version}`;
        } else if (!hasQueryParams) {
          c.url = `${c.url}?version=${version}`;
        }
      }
      return c;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(  
    (response: any) => {
      return response;
    },
    (error: any) => {
      if (
        (error && error.response && error.response.status === 401) ||
        error.response.status === 406
      ) {
        doLogout();
      }
      if (error?.response?.status >= 400 && error?.response?.status <= 499) {
        message.error({
          key: "error",
          content:
            error.response.data.title ||
            "Opps, an error occurred. Please try after sometime.",
          duration: 10,
        });
      }
      return Promise.reject(error);
    }
  );
  // Add a request interceptor
  axiosInstance.interceptors.request.use(
    (c: any) => {
      return c;
    },
    (error: any) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );


  useEffect(() => {
    if (isLocationPermissionGiven) {
      if (isLocationApiCall) {
        fetchSelectedCityById();
      }
      fetchLocation(selectedLanguage)

    }
  }, [isLocationPermissionGiven, selectedCity])

  useEffect(() => {
    if (!loginUserData?.data?.userId && encryptedAdminAuth?.user?.token) {
      dispatch(
        fetchLoginUser({
          Authorization: `Bearer ${encryptedAdminAuth?.user?.token}`,
        })
      );
    } else {
      fetchLogin()
    }
    updateCookieExpiration();
  }, [encryptedAdminAuth?.user?.token]);

  useEffect(() => {
    handleGetOtpOptions();
    return () => {
      SET_SHOW_WHATSAPP_OTP_OPTION(false);
    };
  }, [settingData]);

useEffect(() => {
  const init = async () => {
    if (!loginUserData && !loginState) return;

    const env = await detectPWAEnvironment();
    const platform = env.platform;
    const isPwa = env.isPWAInstalled;
    const userId =
      loginUserData?.data?.[0]?.id || loginState?.data?.[0]?.id;

    if (!userId) {
      console.warn("No valid user ID found for Firebase token registration.");
      return;
    }

    if (platform === "iOS") {
      window.receiveDeviceToken = async (token) => {
        console.log("📲 Received iOS FCM token from native:", token);
        if (token) {
          await storeFirebaseToken(token, userId);
          await storeData("firebaseToken", token);
        } else {
          console.warn("⚠️ Native returned an empty token.");
        }
      };

      if (window.webkit?.messageHandlers?.['get-fcm-token']) {
        window.webkit.messageHandlers['get-fcm-token'].postMessage(null);
        console.log("📡 Requested token from native iOS.");
      } else {
        console.warn("❌ Native 'get-fcm-token' handler not available.");
      }
    } else {
      setupNotifications(async (token) => {
        if (token) {
          await storeFirebaseToken(token, userId);
        } else {
          console.warn("No Firebase token generated.");
        }
      });
    }
  };

  init();
}, [loginUserData, loginState]);

  useEffect(() => {
    fetchInitialData()
  }, [selectedCity]);

  useEffect(() => {
    if (!selectedCity) {
      if (loginUserData?.data?.[0]?.locationid) {
        setSelectedCity(loginUserData?.data?.[0]?.locationid)
        fetchSelectedCityById();
      }
    }
    if (!selectedCityName) {
      fetchSelectedCityById();
    }

  }, [loginUserData])

  useEffect(() => {
    if (!settingData?.data) {
      dispatch(fetchSettingData());
    }

  }, [settingData?.data])


  useEffect(() => {

    if (!isStorageAvailable()) {
      console.warn("⚠️ Storage unavailable: Showing custom message.");

      const warningElement = document.getElementById("storage-warning");
      if (warningElement) {
        warningElement.style.display = "block";
      }
    } else {
      // console.log("✅ Storage available: Hiding warning.");

      const warningElement = document.getElementById("storage-warning");
      if (warningElement) {
        warningElement.style.display = "none";
      }
    }

    const handleLocationFetch = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setPosition({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });

            if (
              position.coords.latitude &&
              position.coords.longitude &&
              !isLocationFetched.current
            ) {
              isLocationFetched.current = true;

              // Check if permission was previously granted
              const isPermissionPreviouslyGranted = await getData("isLocationPermissionGiven");

              if (!isPermissionPreviouslyGranted) {
                await storeData("isLocationPermissionGiven", "true");
                setIsLocationPermissionGiven(true);
                setSelectedCity(0)
                // fetchSelectedCityById()
              }
            }
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              console.warn("User denied geolocation permission.");
            }
          },
          {
            enableHighAccuracy: true, // ✅ added for better precision
            timeout: 10000, // optional: 10 sec timeout
            maximumAge: 0     // optional: do not use cached position
          }
        );
      } else {
        message.error("Geolocation is not available in your browser.");
      }
    };


    // Monitor geolocation permission changes, including reset
    const monitorPermissionChanges = async () => {
      if ("permissions" in navigator) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {

            const updatePermissionState = async () => {
              if (permissionStatus.state === "granted") {
                handleLocationFetch(); // Fetch location if permission is granted
              } else {
                // Remove from localStorage if permission is denied or reset
                await removeItem("currentUserLocation");
                await removeItem("isLocationPermissionGiven");
                setIsLocationPermissionGiven(false);
                console.warn("Geolocation permission has been denied or reset.");
              }
            };

            // Check the current state
            updatePermissionState();

            // Listen for changes to permission status
            permissionStatus.onchange = () => {
              updatePermissionState();
            };
          });
      }
    };

    // Initial location fetch and permission monitoring
    handleLocationFetch();
    monitorPermissionChanges();

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const Returning_User = storeSessionData("Returning_User");

    if (!Returning_User) {
      if (LOGEVENTCALL) {
        logEffect(logEvents.Returning_User);
      }
      getSessionData("Returning_User");
    }
    window.addEventListener("beforeinstallprompt", handler);
    // fetchInitialData()

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  
    useEffect(() => {
      if (location.pathname.startsWith("/api/")) {
        window.location.href = "https://adonline.in/";  
      }
    }, [location, navigate]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data?.type === "NOTIFICATION_RECEIVED") {
            //console.log("📨 Message from SW:", event.data.payload);
            dispatch(fetchSettingData());
          }
        });
      });
    }
  }, [dispatch]);

  return (
    <LayoutContext.Provider
      value={{
        setPosition,
        filterValue,
        setFilterValue,
        position,
        doLogout,
        SHOW_WHATSAPP_OTP_OPTION,
        categoryList,
        setSelectedCity,
        postData,
        isLoading,
        setPrevFilterData,
        setIsLoading,
        prevFilterData,
        setPostData,
        setPremiumPostData,
        premiumPostData,
        selectedCity,
        searchValue,
        setSearchValue,
        setIsOpenProfilePopup,
        openProfilePopup,
        setIsPostClear,
        isPostClear,
        setIsHomeClick,
        isHomeClick,
        showInstallButton,
        deferredPrompt,
        setDeferredPrompt,
        setShowInstallButton,
        setIsSearchOpen,
        isSearchOpen,
        setSelectedLanguage,
        selectedLanguage,
        setIsLoginLanguageSet,
        isLoginLanguageSet,
        setMenuOpenDrawer,
        menuOpenDrawer,
        setIsTransition,
        isTransition,
        setSelectedGridOption,
        selectedGridOption,
        setAdOptionModalOpen,
        AdOptionModalOpen,
        defaultMessageType,
        setIsPremiumAd,
        isPremiumAd,
        setSelectedCityName,
        selectedCityName,
        setIsLanguageChange,
        isLanguageChage,
        setIsLocationApiCall,
        isLocationApiCall,
        slotData,
        setIsDarkMode,
        isDarkMode,
        setIsFeatchCategoryCount,
        isFeatchCategoryCount,
        activeTab,
        setActiveTab,
        updatePostCounts,
        setIsRefetch,
        isRefetch,
        setIsScrooling,
        isScrolling,
        refetch,
        setMessageCount,
        messageCount,
        setShouldHideBottomNavigation,
        shouldHideBottomNavigation,
        handleMoreMenuNavigate: (route) => {
          const isHome = route === "/";
          //const navItem = NAVIGATION_LINKS.find(link => link.route === route);
          if (isHome) {
            setActiveTab(1);
          } else {
            setActiveTab(5);
          }
          // if (isHome) {
          //   setActiveTab(1);
          //   setIsPremiumAd(false);
          //   setIsPostClear(true);
          //   removeItem("filters").then(() => {
          //     setFilterValue({
          //       UserId: 0,
          //       PageNumber: 1,
          //       Search: "",
          //       LocationId: selectedCity,
          //       Favorites: false,
          //       IsPremiumAd: true,
          //       LanguageId: selectedLanguage,
          //       SubCategoryId: "",
          //       IsPost: true,
          //       Frequency: "",
          //     });
          //     setPostData([]);
          //     setIsLoading(true);
          //   });
          // } else if (navItem) {
          //   setActiveTab(5);
          // }

          navigate(route);
          // setMenuOpenDrawer(false);
        },
        transactionHistoryRefreshKey,
        setTransactionHistoryRefreshKey
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default React.memo(LayoutContextProvider);
