import HomeStyles from "../../container/home/HomeStyle.module.scss";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useContext, useEffect, useState, useRef } from "react";
import { LayoutContext } from '../../components/layout/LayoutContext';
import { useNavigate } from "react-router-dom";
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { RootState } from '../../redux/reducer';
import { useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from "react-i18next";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AdOptionDialog from "../../dialog/AdOptionDialog";
import PremiumModal from "../../dialog/premiumModal/PremiumModal";
import PostDetailsDialog from "../../dialog/postDetails/PostDetailDialogContainer";
import { Badge, message } from "antd";
import PutAdDialog from "../../dialog/postDetails/PutAdDialog";
import { getCategory } from "../../redux/services/post.api";
import LoginDialog from "../../dialog/LoginDialog";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeIcon from "@mui/icons-material/Home";
import myPostFill from "../../assets/icons/mypost_fill 1.svg";
import { getData, removeItem } from "../../utils/localstorage";
import { NAVIGATION_LINKS } from '../../libs/constant';
import useAvailableSlots from "../../features/Home/hooks/useAvailableSlots";
import { ChatBubbleOutline } from "@mui/icons-material";
import ChatIcon, { ChatFilledIcon } from "../../assets/icons/ChatIcon";
import { clearAllPostData } from "../../redux/slices/postSlice";
import { GetMessageCount } from "../../redux/services/chat.api";


const BottomNavigationComponent = () => {
  const { filterValue, postData, setPostData,setIsRefetch,setShouldHideBottomNavigation,setMessageCount,messageCount, setFilterValue,slotData, setIsFeatchCategoryCount,searchValue, setIsLoading, selectedCity, isHomeClick, setIsHomeClick, setMenuOpenDrawer, AdOptionModalOpen, selectedLanguage, setAdOptionModalOpen, setIsPremiumAd, setIsPostClear, activeTab, setActiveTab, handleMoreMenuNavigate, menuOpenDrawer, ...layoutContext } = useContext(LayoutContext);
  const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
  const [myProfilePopup, setMyProfilePopup] = useState(false);
  const [isPutAdModalOpen, setIsPutAdModalOpen] = useState(false);
  const [isPremiumAdModalOpen, setIsPremiumAdModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [loginModelOpen, setLoginModelOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [navigationKey, setNavigationKey] = useState(0);
  const { isDarkMode } = useContext(LayoutContext);
  const [lastTabBeforeMore, setLastTabBeforeMore] = useState(activeTab);
  const didNavigateFromMore = useRef(false);
  const isFavoritesTabActive = activeTab === 2;
  const isMyAdsTabActive = activeTab === 4;
  

  //useEffect(() => {
  //  const handleTabSwitch = () => {
  //    window.scrollTo(0, 0); 
  //  };

  //  window.addEventListener('focus', handleTabSwitch);

  //  return () => {
  //    window.removeEventListener('focus', handleTabSwitch);
  //  };
  //}, []);


  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      if (AdOptionModalOpen && event.state && event.state.dialogOpen) {
        setAdOptionModalOpen(false);
      }
      if (isPutAdModalOpen && event.state && event.state.dialogOpen) {
        setIsPutAdModalOpen(false);
      }
    };

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
  }, [isPutAdModalOpen, AdOptionModalOpen]);


  const handleTabChange = (event, newValue) => {
    if (newValue === activeTab) return;
    setActiveTab(newValue);
  };

  useEffect(() => {
    setNavigationKey(prev => prev + 1);
   
  }, [loginUserData]);

  useEffect(() => {

    if (!menuOpenDrawer && activeTab === 5 && !didNavigateFromMore.current) {
      setActiveTab(lastTabBeforeMore);
    }

    if (!menuOpenDrawer) {
      didNavigateFromMore.current = false;
    }
  }, [menuOpenDrawer]);



  const handleFavClick = () => {

    if (isFavoritesTabActive) return;
    if (loginUserData.data) {
      setIsPostClear(true)
      setFilterValue({
        ...filterValue,
        IsPost: true,
        LanguageId: selectedLanguage,
        SubCategoryId: "",
        PageNumber: 1,
        IsPremiumAd: false,
        Favorites: true,
        UserId: 0
      });
      setActiveTab(2);
      handleTabButtonClick();
      setIsPremiumAd(false);
      setIsHomeClick(false);
      setIsLoading(true);

      setPostData([]);
      // setIsPostClear(true);
      setIsHomeClick(false);
      // localStorage.setItem("filters", JSON.stringify({
      //   ...filterValue,
      //   IsPost:true,
      //   PageNumber: 1,
      //   Favorites: true,
      //   UserId: 0,
      // }));
      navigate("/")
    } else {
      setLoginModelOpen(true)
    }

  }

  const handleChatClick = () => {
        if (loginUserData.data) {
          clearAllPostData(); setIsRefetch(true); setIsPostClear(true); navigate("/chat"); handleTabButtonClick(); setFilterValue({
            ...filterValue,
            PageNumber: 1 
          });

        } else {
          setLoginModelOpen(true)
        }}


  const handleTabButtonClick = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  const isIOS = () => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (loginUserData.data) {
      if (loginUserData.data[0]?.roleid === 1) {
        setAdOptionModalOpen(true);
      } else {
        setIsPutAdModalOpen(true);
      }
    } else {
      setLoginModelOpen(true);
    }
  };


  const BottomNavigationMenu = [
    {
      id: 1, icon: <HomeOutlinedIcon className='svg-width' onClick={async (e) => {
        e.preventDefault();
        navigate("/");

        // Wait briefly to ensure navigation happens before state updates
        await new Promise(resolve => setTimeout(resolve, 50));
        if (isHomeClick) return;

        // Reset states
        setIsPremiumAd(false);
        await removeItem("filters");

       setFilterValue({
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
          });
        setIsRefetch(false)
        setPostData([]);
        setIsPostClear(true);
        handleTabButtonClick();
        setIsHomeClick(true);
        setIsFeatchCategoryCount(true);
        setIsLoading(true);
      }} />,
      activeIcon: <HomeIcon style={{ cursor: isHomeClick ? "not-allowed" : "pointer" }} className='svg-width' />,
      label: <span onClick={async (e) => {
        e.preventDefault();
        navigate("/");
        await new Promise(resolve => setTimeout(resolve, 50));
        if (isHomeClick) return;
        setIsPremiumAd(false);
        setIsPostClear(true);
        await removeItem("filters");
        setFilterValue({
          ...filterValue,
          UserId: 0,
          PageNumber: 1,
          Search: "",
          LocationId: selectedCity,
          Favorites: false,
          IsPremiumAd: true,
          LanguageId: selectedLanguage,
          SubCategoryId: "",
          IsPost: true,
        });
        setPostData([]);
        handleTabButtonClick();
        setIsHomeClick(true);
        setIsLoading(true);
        removeItem("adUpdateResponse")
      }}> {t("Menus.Home")}</span>
    },
    // {
    //   id: 2, icon: <FavoriteBorderIcon className='svg-width' onClick={() => {
    //     if (filterValue?.Favorites) return; // disable if already selected
    //     handleFavClick();
    //   }} style={{  cursor: filterValue?.Favorites ? "not-allowed" : "pointer" }} />, activeIcon: <FavoriteIcon style={{  cursor: filterValue?.Favorites ? "not-allowed" : "pointer" }}  className='svg-width' />,
    //   label: <span onClick={(e) => { if (filterValue?.Favorites) return; e.preventDefault(); handleFavClick() }}>{t("Menus.Favourites")}</span>
    // },
    {
     id: 2,
  icon: (
    <Badge count={messageCount} size="small" color='red' style={{width: "16px", height: "16px", borderRadius: "50%"}} offset={[-3, 2]}>
      <ChatIcon className="svg-width" onClick={handleChatClick} />
    </Badge>
  ),
  activeIcon: (
    <Badge count={messageCount} size="small" color='red' style={{width: "16px", height: "16px", borderRadius: "50%"}} offset={[-3, 2]}>
      <ChatFilledIcon className="svg-width" />
    </Badge>
  ),
  label: (
    <span
      onClick={() => {
        loginUserData?.data ? navigate("/chat") : setLoginModelOpen(true);
      }}
    >
      {t("Menus.Chat")}
    </span>
  )
    },
    {
      id: 3, icon: <div className='add-btn circle' onClick={handleClick}><AddIcon className='svg-width' /></div>,
      type: "AddPost", label: <div><span onClick={handleClick}>{t("Menus.Add new")}</span>
        {slotData[0]?.isadfree === 1 && <p className="free-tag">Free</p>}
      </div>
    },
    {
      id: 4, icon: <PostAddIcon style={{ cursor: filterValue?.Favorites ? "not-allowed" : "pointer" }} className='svg-width' onClick={() => {
        if (isMyAdsTabActive) return;
        //    localStorage.setItem("filters", JSON.stringify({
        //     ...filterValue,PageNumber: 1, IsPost:true, UserId: loginUserData?.data && loginUserData?.data[0]?.id, Favorites: false
        // })); 
        if (loginUserData?.data) {
          setIsPostClear(true);
          setFilterValue({
            ...filterValue, PageNumber: 1, LanguageId: selectedLanguage,
            SubCategoryId: "", IsPost: true, UserId: loginUserData?.data[0]?.id, Favorites: false
          }); setPostData([]); setIsHomeClick(false); setIsLoading(true); navigate("/"); handleTabButtonClick()
        } else {
          setLoginModelOpen(true)
        }

      }} />,
      activeIcon: <img src={myPostFill} style={{ cursor: filterValue?.Favorites ? "not-allowed" : "pointer", width: "51%", height: "49%", marginBottom: "5px" }} />,
      label: <span onClick={() => {
        if (isMyAdsTabActive) return;
        if (loginUserData.data) {
          setIsPostClear(true);
          setFilterValue({
            ...filterValue, PageNumber: 1, LanguageId: selectedLanguage,
            SubCategoryId: "", IsPost: true, UserId: loginUserData?.data && loginUserData?.data[0]?.id, Favorites: false
          }); setPostData([]); setIsPostClear(true); navigate("/"); handleTabButtonClick()
        } else {
          setLoginModelOpen(true)
        }
      }}>{t("Menus.My Ads")}</span>
    },
    { id: 5, icon: <MoreHorizIcon className='svg-width' onClick={(e) => { e.preventDefault(); setLastTabBeforeMore(activeTab); setMenuOpenDrawer(true) }} />, label: <span onClick={() => setMenuOpenDrawer(true)}>{t("Menus.More")}</span> },
  ]

  const handleTabClick = async (d) => {
    if (d.id === 1 && isHomeClick) return;
    if (d.id === 4 && isMyAdsTabActive) return;

    try {
      if (d.id === 1) {
        setIsPremiumAd(false);
        setIsPostClear(true);
        await removeItem("filters");
        setFilterValue({
          ...filterValue,
          UserId: 0,
          PageNumber: 1,
          Search: "",
          LocationId: selectedCity,
          Favorites: false,
          IsPremiumAd: true,
          LanguageId: selectedLanguage,
          SubCategoryId: "",
          IsPost: true,
          Frequency: 0,
        });
        setPostData([]);
        setIsHomeClick(true);
        setIsFeatchCategoryCount(true);
        setIsLoading(true);
        navigate("/");
      } else if (d.id === 4 && loginUserData?.data) {
        setIsPostClear(true);
        setFilterValue({
          ...filterValue,
          PageNumber: 1,
          LanguageId: selectedLanguage,
          SubCategoryId: "",
          IsPost: true,
          UserId: loginUserData?.data[0]?.id,
          Favorites: false,
        });
        setPostData([]);
        setIsHomeClick(false);
        setIsLoading(true);
        navigate("/");
      }
      handleTabButtonClick();
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <>
      <div className={isDarkMode ? HomeStyles.bottomNavigationDark : HomeStyles.bottomNavigation}>
        <BottomNavigation className="bottom-navigation" key={navigationKey} value={activeTab} onChange={handleTabChange} showLabels={true} sx={{ justifyContent: 'space-between', paddingBottom: isIOS() ? "2px" : "2px", }} >
          {BottomNavigationMenu?.map((d, index) => (
            <BottomNavigationAction
              key={index}
              label={d.label}
              icon={activeTab === d.id ? d.activeIcon || d.icon : d.icon}
              className={d?.type === "AddPost" ? 'add-btn-position' : ""}
              sx={{ flex: 1, minWidth: "auto", maxWidth: "fit-content", color: isDarkMode ? "#fff" : "#000" }}
              value={d.id}
              onClick={(e) => {
                e.preventDefault();
                if (d.id === 1 || d.id === 4) {
                  handleTabClick(d);
                }  else if (d.id === 3) {
                  handleClick(e);
                } else if (d.id === 5) {
                  if (lastTabBeforeMore === 1) {
                    setActiveStep(1);
                  } else {
                    setLastTabBeforeMore(activeTab);
                    setMenuOpenDrawer(true);
                  }
                }
              }}
            />
          ))}
        </BottomNavigation>

        {AdOptionModalOpen && (
          <AdOptionDialog
            open={AdOptionModalOpen}
            setIsPutAdModalOpen={setIsPutAdModalOpen}
            setIsPremiumAdModalOpen={setIsPremiumAdModalOpen}
            isPutAdModalOpen={isPutAdModalOpen}
            isPremiumAdModalOpen={isPremiumAdModalOpen}
            handleClose={() => {
              setAdOptionModalOpen(false);
            }}
            handleOk={() => {
              setAdOptionModalOpen(false);
            }}
          />
        )}

        {isPremiumAdModalOpen && (
          <PremiumModal
            open={isPremiumAdModalOpen}
            handleClose={() => setIsPremiumAdModalOpen(false)}
            selectedCity={selectedCity}
            handleOk={(resp) => {
              if (resp.success) {
                setIsPremiumAdModalOpen(false);
                setFilterValue({ ...filterValue, PageNumber: 1 });
              }
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
              handleOk: (response) => {
                if (activeStep === 0 && response?.success)
                  setActiveStep(activeStep + 1);
                if (activeStep === 1 && response?.success) {
                  setIsPutAdModalOpen(false);
                  message.success(response.message);
                  setFilterValue({ ...filterValue, PageNumber: 1 });
                }
              },
              activeStep: activeStep,
              setActiveStep: setActiveStep,
            }}
          />
        )}

        {loginModelOpen && (
          <LoginDialog
            open={loginModelOpen}
            handleClose={(event, reason) => {
              if (reason && reason === "backdropClick") return;
              setLoginModelOpen(false);
            }}
            handleOk={(res) => {
              setLoginModelOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default BottomNavigationComponent;