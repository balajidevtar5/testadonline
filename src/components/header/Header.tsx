import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  Drawer,
  Grid,
  IconButton,
  Menu,
  Paper,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import "../../components/header/HeaderStyles.module.css";
import headerStyles from "../../components/header/HeaderStyles.module.scss";
import { LayoutContext } from '../layout/LayoutContext';
import { NavigationLogo } from '../../features/Header/components/NavigationLogo';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../redux/reducer";
import {
  getLanguageList,
} from "../../redux/services/setting.api";
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useTranslation } from "react-i18next";
import { LocationLanguageSelector } from '../../features/Header/components/locationLanguageSelector';
import { useForm } from "react-hook-form";
import { useCookies } from 'react-cookie';
import { getDecryptedCookie } from '../../utils/useEncryptedCookies';
import { ArrowDropDownCircleOutlined } from '@mui/icons-material';
import { MAIN_COLOR } from "../../config/theme";
import { CloseDialogComponent } from "../../components/CloseDialogComponent";
import { UserMenuList } from '../../features/Header/components/userMenuList';
import { HeaderMenu } from '../../features/Header/functions/headerMenu';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginDialog from '../../dialog/LoginDialog';
import AddFundComponent from '../addFund/AddFundComponent';
import ProfileDialog from '../../dialog/profileDialog';
import { handleChangeLanguage } from '../../features/Header/functions/handleChangeLanguage';
import { fetchLocationData } from "../../redux/slices/location";
import { fetchSelectedCityById } from '../../features/Header/functions/fetchSelectedCityById';
import { areCookiesEnabled, getData, isStorageAvailable, removeItem, storeData } from "../../utils/localstorage";
import {
  GetDesinOption,
  LanguageEnum,
  LOGEVENTCALL,
  logEvents,
} from "../../libs/constant";
import { BouncePopup } from '../../features/Header/components/bouncePopUp';
import SuccessDialog from '../../dialog/SuccessDialog';
import LanguageDropdown from './LanguageDropdown';
import instagramImage from "./../../assets/images/instagram.png";
import facebookImage from "./../../assets/images/facebook.png";
import SmoothPopup from '../../dialog/animations/FancyAnimatedDialog';
import AppNotification from '../appnotification/appnotification';
import { NotificationBell } from '../../features/Header/components/notificationBell';
import LightModeIcon from '@mui/icons-material/LightMode';
import { NotificationPermissionAccess } from '../../features/Header/functions/notificationPermissionAccess';
import { UpdateTheme } from '../../redux/services/user.api';
import { fetchLoginUser } from '../../redux/slices/auth';
import { detectPWAEnvironment } from '../../utils/pwaUtils';


const Header = () => {
  const [whatsappLink, setWhatsAppLink] = useState("");
  const [YouTubeLinks, setYouTubeLinks] = useState<Record<string, string>>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [addFundModalOpen, setIsAddFundModalOpen] = useState(false);
  const [isLogout, setIsLogOut] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState(1);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState("");
  const [isLocationPermissionGiven, setIsLocationPermissionGiven] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState([]);
  const [successDialog, setSuccessDialog] = useState(false);
  const { register, formState, control, setValue } = useForm();
  const [languageList, setLanguageList] = useState([]);
  const [isAppNotification, setIsAppNotification] = useState(false);
  const [isLocationPicker, setIsLocationPicker] = useState(false);
  const [visitedUser, setVisitedUser] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const dispatch: any = useDispatch();

  const {
    position,
    filterValue,
    setFilterValue,
    setIsPremiumAd,
    setIsFeatchCategoryCount,
    setIsPostClear,
    setIsLoading,
    searchValue,
    selectedCity,
    handleMoreMenuNavigate,
    isLoading: isPostDataLoading,
    selectedCityName,
    setSelectedLanguage,
    setMenuOpenDrawer,
    selectedLanguage,
    setSelectedCity,
    setIsTransition,
    setTransactionHistoryRefreshKey,
    setIsRefetch,
    doLogout,
    menuOpenDrawer,
    setIsDarkMode,
    isDarkMode,
    openProfilePopup,
    setIsOpenProfilePopup,
    
  } = useContext(LayoutContext);

  const [{ adminAuth }]: any = useCookies(["adminAuth"]);
  const encryptedAdminAuth = getDecryptedCookie(adminAuth)

  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const { data: settingData } = useSelector(
    (state: RootState) => state.settingList
  );

  const { data: loginUserData } = useSelector(

    (state: RootState) => state.loginUser
  );

  const { data: loginState } = useSelector(
    (state: RootState) => state.login
  );

  const { data: cityData } = useSelector((state: RootState) => state.cities);

  // Initialize menu items
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

  useEffect(() => {
    if (!openProfilePopup) {
      document.body.classList.remove("profilecity");
    }
  }, [openProfilePopup]);

  useEffect(() => {
    const run = async () => {
      const { isPWAInstalled, platform } = await detectPWAEnvironment();
  
      
      if (isPWAInstalled && platform === "Android") return ; 
  
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
  
      let permissionListener: (() => void) | null = null;
  
      navigator.permissions
        .query({ name: "notifications" })
        .then((permission) => {
          permissionListener = () => {
            checkNotificationPermission();
          };
          permission.addEventListener("change", permissionListener!);
        })
        .catch((error) => console.error("Permission API not supported:", error));
  
      return () => {
        if (permissionListener) {
          navigator.permissions
            .query({ name: "notifications" })
            .then((permission) => {
              permission.removeEventListener("change", permissionListener!);
            })
            .catch((error) =>
              console.error("Permission API cleanup error:", error)
            );
        }
      };
    };
  
    run();
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

  // Initialize platform detection
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream);
  }, []);

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



  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find((item) =>
      currentPath.includes(item.link || item.mode)
    );
    if (activeItem) {
      setActiveMenuItem(activeItem.id);
    }
  }, [location.pathname, menuItems]);


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsLogOut(false);
  };

  const handleShareApp = async (e) => {
    if (!loginUserData?.data) {
         setIsLoginModalOpen(true);
         setAnchorEl(null);
         setMenuOpenDrawer(false);
         return;
       }
    navigate('/transactionhistory');
    setAnchorEl(null)
    await new Promise((resolve) => {
      setMenuOpenDrawer(false);
      setTimeout(resolve, 50);
    });
  };

  const open = Boolean(anchorEl);
  const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
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

  useEffect(() => {
    fetchLanguageApi();
  }, [position]);

  useEffect(() => {
    if (!openProfilePopup) {
      document.body.classList.remove("profilecity");
    }
  }, [openProfilePopup]);

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

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [isDarkMode])

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
      setWhatsAppLink(whatsappSetting.value); // Update state with the URL
    }

    const isNotification = settingData?.data?.find(
      (item) => item.name === "NotificationCount"
    );
    setYouTubeLinks(links); // Update state once after the loop
  }, [settingData]);  

  useEffect(() => {
    const setInitialLanguage = async () => {
      if (languageList?.length > 0) {
        let localStoragelanguageId = await getData("i18nextLng");
        let languageId = localStoragelanguageId || 2;
        const language = languageList.find((elm) => elm.value == languageId);
        if (language) {
          setValue("language", language);
          i18n.changeLanguage(language.initialname);
          setSelectedLanguage(languageId);
          // If you have Redux or other state, update it here as needed
        }
      }
    };
    setInitialLanguage();
  }, [languageList]);

  const handleNotificationPermission = async () => {
    await NotificationPermissionAccess({
      loginUserData,
      loginState,
      t
    });
  };

  return (
    <div className={`${headerStyles.headerContainer} headerContainer`}>
      <Grid container alignItems="center" justifyContent="space-between">
        <div className="d-flex align-items-center justify-content-between w-100">
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
          <div className='d-flex align-items-center'>
            <Grid
              justifyContent="flex-end"
              className="d-flex align-items-center w-xs-100 justify-content-end w-100"
            >
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
              <div className={`d-flex align-items-center ${headerStyles.p10}`}>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="responsive-flex cursor-pointer d-flex align-items-center justify-content-center"
                >
                  <WhatsAppIcon className="text-green font-24" />
                  <p className={`text-sm text-black font-medium mt-1 mt-0 mb-0 ml-5 hideOnSmall ${headerStyles.hideOnSmall}`}>
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
                  <p className={`text-sm text-black font-medium mt-1 mt-0 mb-0 ml-5 pr-10 ${headerStyles.hideOnSmall}`}>
                    {t("General.Join Group")}
                  </p>
                </a>
              </div>
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center mobile-header-scroll">
                  <div className={`${!isLocationPermissionGiven ? "ml-10 mr-10" : ""
                    }`}>
                    <NotificationBell
                      notificationCount={notificationCount}
                      isLocationPermissionGiven={isLocationPermissionGiven}
                      NotificationPermissionAccess={handleNotificationPermission}
                      isDarkMode={isDarkMode}
                      setIsAppNotification={setIsAppNotification}
                      loginUserData={loginUserData}
                      setIsLoginModalOpen={setIsLoginModalOpen}
                    />
                  </div>

                  <a href="#" className="mr-10 top3">
                    <LightModeIcon onClick={handleThemeClick} className={`${isDarkMode ? "text-grey-800" : "text-grey"} font-24`} />
                  </a>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <LanguageDropdown
                  register={register}
                  formState={formState}
                  control={control}
                  languageList={languageList}
                  handleChangeLanguage={handleLanguageChange}
                />
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
              </div>

            </Grid>
          </div>
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
              isAndroid={isAndroid()}
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
                isAndroid={isAndroid()}
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
        {/*<div className="d-flex justify-content-between mb-5 search-box">
         
      </div>  */}
      </Grid>
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

  )
}

export default Header
