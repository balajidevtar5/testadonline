import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ListItemIcon,
  MenuItem,
  Typography,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  UserOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Logout } from "@mui/icons-material";
import { ShareOutlined } from "@mui/icons-material";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoIcon from "@mui/icons-material/Info";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DescriptionIcon from "@mui/icons-material/Description"
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoginIcon from "@mui/icons-material/Login";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import { SelectField } from "../../../components/formField/FormFieldComponent";
import { getData, storeData } from "../../../utils/localstorage";
import { PricingPolicyIcon } from "../../../assets/icons/pricingPolicyIcon";
import { RefundIcon } from "../../../assets/icons/refundIcon";
import "../../../components/header/HeaderStyles.module.scss";
import StarsIcon from '@mui/icons-material/Stars';
import referEng from "../../../assets/images/referEng.png";
import referGuj from "../../../assets/images/referGuj.png";
import referHindi from "../../../assets/images/referHindi.png";
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useTheme } from "@mui/material/styles";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTranslation } from 'react-i18next';


export const UserMenuList = ({
  loginUserData,
  setIsLoginModalOpen,
  setMenuOpenDrawer,
  setAnchorEl,
  handleMoreMenuNavigate,
  setIsOpenProfilePopup,
  setIsAddFundModalOpen,
  setIsLogOut,
  register,
  formState,
  control,
  languageList,
  handleChangeLanguage,
  t,
  isDarkMode,
  handleShareApp,
  instagramImage,
  facebookImage,
  YouTubeIcon,
  isIOS,
  isAndroid,
  setFilterValue,
  filterValue,
  setIsFeatchCategoryCount,
  HeaderMenu,
  setPendingNavigation,
  selectedLanguage,
  setIsRefetch
}) => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);

  const NEWMENU = [
    { id: 1, label: t("Menus.Festival"), route: "https://adonline.in/post/festival-greetings", isNew: true , icon: AutoAwesomeIcon },
  ]

  useEffect(() => {
    (async () => {
      const stored = await getData("seenMenuItems");
      const seenIds = Array.isArray(stored) ? stored : [];
  
      setMenuItems(
        NEWMENU.map(item => ({
          ...item,
          isNew: !seenIds.includes(item.id)
        }))
      );
    })();
  }, []);

  const handleMenuClick = async (item) => {
    setMenuOpenDrawer(false);
  
    const stored = await getData("seenMenuItems");
    const seenIds = Array.isArray(stored) ? stored : [];
  
    if (!seenIds.includes(item.id)) {
      await storeData("seenMenuItems", [...seenIds, item.id]);
    }
  
    setMenuItems(prev =>
      prev.map(m => m.id === item.id ? { ...m, isNew: false } : m)
    );
  
    if (item.route.startsWith("http")) {
      window.open(item.route, "_blank");
    } else {
      handleMoreMenuNavigate(item.route);
    }
  };

  const typographyStyles = {
    fontSize: "15px",
    fontFamily: "Poppins,sans-serif",
    fontWeight: 400,
    lineHeight: "24px",
    color: isDarkMode ? "#fff" : "#3C444B",
  };

  const commonMenuStyles = {
    fontSize: "15px",
    fontFamily: "Poppins,sans-serif",
    color: isDarkMode ? "#fff" : "#3C444B",
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

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpenDrawer(false);
  };

  const handleFieldClick = async (callback) => {
    // First close the drawer and menu
    setAnchorEl(null);
    setMenuOpenDrawer(false);

    // Wait a small delay to ensure drawer is closed
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Then execute the callback if provided
    if (callback) {
      await callback();
    }
  };

    const handleFavClick = () => {
    if (loginUserData.data) {
      setFilterValue({
        ...filterValue,
        IsPost: true,
        LanguageId: selectedLanguage,
        SubCategoryId: "",
        PageNumber: 1,
        IsPremiumAd: false,
        Favorites: !filterValue?.Favorites,
        UserId: 0
      });
      setMenuOpenDrawer(false);
      navigate("/")
      setIsRefetch(true);
    }
  }

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      className="user-menu"
      style={{ height: "100%", overflowY: "auto", scrollBehavior: "smooth" }}
    >
      <div className="px-12 mt-20 mr-30 d-xs-block d-none">
        <SelectField
          {...{
            register,
            formState,
            control,
            id: "language",
            name: "language",
            isSearchable: true,
          }}
          placeholder="Select language"
          options={languageList}
          onSelectChange={(e) => {
            handleChangeLanguage(e);
          }}
          isClearable={false}
          isMulti={false}
        />
      </div>

      <div className="mt-5 d-xs-block">
        {!loginUserData?.data && (
          <MenuItem
            sx={commonMenuStyles}
            onClick={() => handleFieldClick(() => setIsLoginModalOpen(true))}
            className="d-xl-none"
          >
            <ListItemIcon>
              <LoginIcon
                fontSize="small"
                sx={{ color: isDarkMode ? "#fff" : "#252525" }}
              />
            </ListItemIcon>
            {t("General.Login")}
          </MenuItem>
        )}
        <MenuItem
          onClick={async (e) => {
            e.stopPropagation();
            setAnchorEl(null);
            await new Promise((resolve) => {
              setMenuOpenDrawer(false);
              setTimeout(resolve, 50);
            });
            await handleFieldClick(async () => {
              handleMoreMenuNavigate("/");
              setIsFeatchCategoryCount(true);
              setFilterValue({
                ...filterValue,
                IsPost: true,
                IsPremiumAd: true,
                LanguageId: (await getData("i18nextLng")) || 2,
              });
            });
          }}
        >
          <ListItemIcon>
            <HomeOutlinedIcon
              fontSize="medium"
              sx={{
                color: "#ff780c !important",
                "& path": { fill: "#ff780c !important" },
              }}
            />
          </ListItemIcon>
          {t("Menus.Home")}
        </MenuItem>
      </div>
      {loginUserData.data && isMobile && (
        <div>
          <MenuItem
            onClick={() => {
              handleFavClick();
            }}
          >
            <ListItemIcon>
              {filterValue?.Favorites ? (
                <FavoriteIcon
                  style={{ cursor: "pointer" }}
                  className="text-danger"
                />
              ) : (
                <FavoriteBorderIcon
                  style={{ cursor: "not-allowed" }}
                  className="text-danger"
                />
              )}
            </ListItemIcon>
            {t("Menus.Wishlist")}
          </MenuItem>
        </div>
      )}
      {loginUserData?.data && (
        <Accordion sx={commonAccordionStyles}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="user-actions-content"
            id="user-actions-header"
          >
            <ListItemIcon>
              <Box
                sx={{
                  color: isDarkMode ? "#fff !important" : "black !important",
                  "& svg path": {
                    fill: isDarkMode ? "#fff !important" : "black !important",
                  },
                }}
              >
                <UserOutlined className="font-20 text-black mr-5" />
              </Box>
            </ListItemIcon>
            <Typography sx={typographyStyles}>
              {t("Menus.User Actions")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {loginUserData?.data && (
              <MenuItem
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleFieldClick(async () => {
                    setIsOpenProfilePopup(true);
                  });
                }}
              >
                <ListItemIcon>
                  <AccountCircleOutlinedIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                  />
                </ListItemIcon>
                {t("Menus.My profile")}
              </MenuItem>
            )}
            {loginUserData?.data && (
              <MenuItem
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAnchorEl(null);
                  await new Promise((resolve) => {
                    setMenuOpenDrawer(false);
                    setTimeout(resolve, 50);
                  });
                  await handleFieldClick(async () => {
                    handleMoreMenuNavigate("/delete-account");
                    setMenuOpenDrawer(false);
                  });
                }}
              >
                <ListItemIcon>
                  <DeleteOutlineIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                  />
                </ListItemIcon>
                {t("Menus.Delete Account")}
              </MenuItem>
            )}
            {loginUserData?.data && (
              <MenuItem
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAnchorEl(null);
                  await new Promise((resolve) => {
                    setMenuOpenDrawer(false);
                    setTimeout(resolve, 60);
                  });
                  await handleFieldClick(async () => {
                    handleMoreMenuNavigate("/transactionhistory");
                    setMenuOpenDrawer(false);
                  });
                }}
              >
                <div className="d-flex w-100">
                  <ListItemIcon>
                    <AccessTimeIcon
                      fontSize="small"
                      sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                    />
                  </ListItemIcon>
                  {t("Menus.Transaction History")}
                </div>
              </MenuItem>
            )}

            {loginUserData?.data && (
              <MenuItem
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  await handleFieldClick(async () => {
                    setIsAddFundModalOpen(true);
                  });
                }}
              >
                <ListItemIcon>
                  <CurrencyRupeeOutlinedIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                  />
                </ListItemIcon>
                {t("Menus.Add points")}
              </MenuItem>
            )}

            {loginUserData?.data && (
              <MenuItem>
                <div className="d-flex  w-100">
                  <ListItemIcon>
                    <StarsIcon fontSize="small" />
                  </ListItemIcon>
                  {t("Menus.Balance")}
                  <span className="w-100 d-flex pl-34 text-primary">
                    {loginUserData?.data && loginUserData?.data[0]?.balance}{" "}
                    {t("General.Ptr")}
                  </span>
                </div>
              </MenuItem>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      {loginUserData?.data && loginUserData?.data[0]?.roleid === 1 && (
        <>
          <Accordion sx={commonAccordionStyles}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="user-menu-content"
              id="user-menu-header"
            >
              <ListItemIcon>
                <SupervisorAccountOutlinedIcon className="font-20 text-black mr-5" />
              </ListItemIcon>
              <Typography sx={typographyStyles}>
                {t("Menus.Administration")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAnchorEl(null);
                  setPendingNavigation("/user-details");
                  setMenuOpenDrawer(false);
                }}
              >
                <ListItemIcon>
                  <GroupAddOutlinedIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                  />
                </ListItemIcon>
                {t("General.User details")}
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAnchorEl(null);
                  setPendingNavigation("/user-activity");
                  setMenuOpenDrawer(false);
                }}
              >
                <ListItemIcon>
                  <ManageAccountsOutlinedIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                  />
                </ListItemIcon>
                {t("General.User activity")}
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAnchorEl(null);
                  setPendingNavigation("/ShortenUrl");
                  setMenuOpenDrawer(false);
                }}
              >
                <ListItemIcon>
                  <ManageAccountsOutlinedIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                  />
                </ListItemIcon>
                {t("General.Shorten Url")}
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAnchorEl(null);
                  setPendingNavigation("/setting");
                  setMenuOpenDrawer(false);
                }}
              >
                <ListItemIcon>
                  <SettingsOutlinedIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                  />
                </ListItemIcon>
                {t("General.Setting Table")}
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAnchorEl(null);
                  setPendingNavigation("/UserStatistics");
                  setMenuOpenDrawer(false);
                }}
              >
                <ListItemIcon>
                  <EqualizerIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                  />
                </ListItemIcon>
                {t("General.UserStatistics")}
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAnchorEl(null);
                  setPendingNavigation("/CityBasedStatistics");
                  setMenuOpenDrawer(false);
                }}
              >
                <ListItemIcon>
                  <EqualizerIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                  />
                </ListItemIcon>
                {t("General.CityBasedStatistics")}
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAnchorEl(null);
                  setPendingNavigation("/static-phrases");
                  setMenuOpenDrawer(false);
                }}
              >
                <ListItemIcon>
                  <DescriptionIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                  />
                </ListItemIcon>
                {t("General.Static Phrases")}
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAnchorEl(null);
                  setPendingNavigation("/errorlogs");
                  setMenuOpenDrawer(false);
                }}
              >
                <ListItemIcon>
                  <WarningAmberIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#fff" : "#252525" }}
                  />
                </ListItemIcon>
                {t("General.Error logs")}
              </MenuItem>
            </AccordionDetails>
          </Accordion>
        </>
      )}

      <div className="d-xs-block">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="menu-content"
            id="menu-header"
          >
            <ListItemIcon>
              <InfoIcon
                className="font-20 text-black mr-5"
                sx={{
                  color: "#54b4d3 !important",
                  "& path": { fill: "#54b4d3 !important" },
                }}
              />
            </ListItemIcon>
            <Typography sx={typographyStyles}>{t("Menus.About us")}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MenuItem
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setAnchorEl(null);
                await new Promise((resolve) => {
                  setMenuOpenDrawer(false);
                  setTimeout(resolve, 50);
                });
                await handleFieldClick(async () => {
                  handleMoreMenuNavigate("/about");
                  setMenuOpenDrawer(false);
                });
              }}
            >
              <ListItemIcon>
                <InfoOutlinedIcon className="font-20 text-black mr-5" />
              </ListItemIcon>
              <Typography
                style={{ color: isDarkMode ? "#fff" : "#3C444B" }}
                component="span"
                sx={typographyStyles}
              >
                {t("Menus.About us")}
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setAnchorEl(null);
                await new Promise((resolve) => {
                  setMenuOpenDrawer(false);
                  setTimeout(resolve, 50);
                });
                await handleFieldClick(async () => {
                  handleMoreMenuNavigate("/contact");
                });
              }}
            >
              <ListItemIcon>
                <PhoneOutlinedIcon className="font-16 text-black mr-5" />
              </ListItemIcon>
              {t("Menus.Contact us")}
            </MenuItem>
            <MenuItem
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setAnchorEl(null);
                await new Promise((resolve) => {
                  setMenuOpenDrawer(false);
                  setTimeout(resolve, 50);
                });
                await handleFieldClick(async () => {
                  handleMoreMenuNavigate("/policy/pricing");
                  setMenuOpenDrawer(false);
                });
              }}
            >
              <ListItemIcon>
                <PricingPolicyIcon
                  className="font-22 text-black mr-5"
                  style={{ fill: "black", color: "black" }}
                  width={20}
                  height={20}
                />
              </ListItemIcon>
              {t("Menus.Pricing")}
            </MenuItem>
            <MenuItem
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setAnchorEl(null);
                await new Promise((resolve) => {
                  setMenuOpenDrawer(false);
                  setTimeout(resolve, 50);
                });
                await handleFieldClick(async () => {
                  handleMoreMenuNavigate("/policy/terms-condition");
                });
              }}
            >
              <ListItemIcon>
                <DescriptionOutlinedIcon className="font-20 text-black mr-5" />
              </ListItemIcon>
              {t("Menus.Terms & condition")}
            </MenuItem>
            <MenuItem
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setAnchorEl(null);
                await new Promise((resolve) => {
                  setMenuOpenDrawer(false);
                  setTimeout(resolve, 50);
                });
                await handleFieldClick(async () => {
                  handleMoreMenuNavigate("/policy/privacy");
                });
              }}
            >
              <ListItemIcon>
                <PrivacyTipOutlinedIcon className="font-20 text-black mr-5" />
              </ListItemIcon>
              {t("Menus.Privacy policy")}
            </MenuItem>
            <MenuItem
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setAnchorEl(null);
                await new Promise((resolve) => {
                  setMenuOpenDrawer(false);
                  setTimeout(resolve, 50);
                });
                await handleFieldClick(async () => {
                  handleMoreMenuNavigate("/policy/refund");
                });
              }}
            >
              <ListItemIcon>
                <RefundIcon className="font-20 text-black mr-5" />
              </ListItemIcon>
              {t("Menus.Refund policy")}
            </MenuItem>
          </AccordionDetails>
        </Accordion>
      </div>

      <MenuItem
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = "https://wa.me/8160845612";
          setAnchorEl(null);
          setMenuOpenDrawer(false);
        }}
      >
        <ListItemIcon>
          <FeedbackOutlinedIcon
            fontSize="small"
            sx={{
              color: "#3b71ca !important",
              "& path": { fill: "#3b71ca !important" },
            }}
          />
        </ListItemIcon>
        {t("Menus.Feedback")}
      </MenuItem>
      <MenuItem>
        <div
          className="d-flex cursor-pointer align-items-center"
          onClick={(e) => {
            e.stopPropagation();
            handleShareApp();
          }}
          style={{ width: "100%" }}
        >
          <ListItemIcon>
            <ShareOutlined
              fontSize="small"
              sx={{
                color: "#357960 !important",
                "& path": { fill: "#357960 !important" },
              }}
            />
          </ListItemIcon>
          <span className={`${isDarkMode ? "text-white" : "text-grey"} `}>
            {t("General.Share with friends")}
          </span>
        </div>
      </MenuItem>
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          setMenuOpenDrawer(false);
        }}
      >
        <a
          href="https://www.instagram.com/adonline.in/"
          target="_blank"
          className={`${
            isDarkMode ? "text-white" : "text-grey"
          } d-flex align-items-center`}
          rel="noreferrer"
        >
          <ListItemIcon>
            <img src={instagramImage} width="24" />
          </ListItemIcon>
          {t("Menus.Instagram")}
        </a>
      </MenuItem>
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          setMenuOpenDrawer(false);
        }}
      >
        <a
          href="https://www.facebook.com/people/AdOnline-Weekly-Ads/61578654893096/"
          target="_blank"
          className={`${
            isDarkMode ? "text-white" : "text-grey"
          } d-flex align-items-center`}
          rel="noreferrer"
        >
          <ListItemIcon>
            <img src={facebookImage} width="24" />
          </ListItemIcon>
          {t("Menus.Facebook")}
        </a>
      </MenuItem>
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          setMenuOpenDrawer(false);
        }}
      >
        <a
          href="https://youtube.com/shorts/XlzSznIo-sM?si=DR-DC90fDNr7Ecrq"
          target="_blank"
          className={`${
            isDarkMode ? "text-white" : "text-grey"
          } d-flex align-items-center`}
          rel="noreferrer"
        >
          <ListItemIcon>
            <YouTubeIcon className="text-red fontSize-28" fontSize="large" />
          </ListItemIcon>
          {t("Menus.How it works?")}
        </a>
      </MenuItem>
      <MenuItem
        onClick={() => {
          const androidAppUrl = "https://bit.ly/3YHsKRI";
          const isTWA = () => {
            return (
              window.matchMedia &&
              window.matchMedia("(display-mode: standalone)").matches &&
              /android/i.test(navigator.userAgent)
            );
          };
          const iosAppUrl =
            "https://apps.apple.com/us/app/adonline-in-buy-sell-app/id6590616607?action=write-review";
          if (isIOS) {
            window.open(iosAppUrl, "_blank");
          } else if (isTWA()) {
            window.location.href = "myapp://review";
          } else {
            window.open(androidAppUrl, "_blank");
          }
          setAnchorEl(null);
          setMenuOpenDrawer(false);
        }}
      >
        <div className="d-flex cursor-pointer align-items-center">
          <ListItemIcon>
            <StarOutlinedIcon
              fontSize="medium"
              sx={{
                color: "#FFBA00 !important",
                "& path": { fill: "#FFBA00 !important" },
              }}
            />
          </ListItemIcon>
          {t("Menus.Rate")}
        </div>
      </MenuItem>
      {loginUserData?.data &&
        menuItems.map((item) => {
          const IconComponent = item.icon; 

          return (
            <MenuItem key={item.id} onClick={() => handleMenuClick(item)}>
              <ListItemIcon>
                <IconComponent fontSize="small" sx={{ color: "#ff780c" }} />
              </ListItemIcon>

              <div
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {item.isNew && (
                  <span
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -12,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#ff780c",
                      boxShadow: "0 0 0 rgba(255, 0, 0, 0.4)",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                )}
                {item.label}
              </div>
            </MenuItem>
          );
        })}
      {loginUserData?.data && (
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLogOut(true);
            setMenuOpenDrawer(false);
          }}
        >
          <ListItemIcon>
            <Logout
              fontSize="small"
              sx={{
                color: "#ff780c !important",
                "& path": { fill: "#ff780c !important" },
              }}
            />
          </ListItemIcon>
          {t("Menus.Logout")}
        </MenuItem>
      )}
      <Box
        className="d-flex justify-content-center pt-10"
        style={{ paddingBottom: "13px" }}
      >
        {selectedLanguage === 1 ? (
          <img
            src={referEng}
            alt="referimg"
            style={{ width: "190px", borderRadius: "5%", cursor: "pointer" }}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setAnchorEl(null);
              if (loginUserData?.data && loginUserData?.data?.length > 0) {
                await handleFieldClick(async () => {
                  handleMoreMenuNavigate("/transactionhistory");
                  setMenuOpenDrawer(false);
                });
              } else {
                setIsLoginModalOpen(true);
                setAnchorEl(null);
                setMenuOpenDrawer(false);
      return;
              }
            }}
          />
        ) : selectedLanguage === 2 ? (
          <img
            src={referGuj}
            alt="referimg"
            style={{ width: "190px", borderRadius: "5%", cursor: "pointer" }}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setAnchorEl(null);
              if (loginUserData?.data && loginUserData?.data?.length > 0) {
                await handleFieldClick(async () => {
                  handleMoreMenuNavigate("/transactionhistory");
                  setMenuOpenDrawer(false);
                });
              } else {
                setIsLoginModalOpen(true);
                setAnchorEl(null);
                setMenuOpenDrawer(false);
                return;
              }
            }}
          />
        ) : selectedLanguage === 3 ? (
          <img
            src={referHindi}
            alt="referimg"
            style={{ width: "190px", borderRadius: "5%", cursor: "pointer" }}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setAnchorEl(null);
              if (loginUserData?.data && loginUserData?.data?.length > 0) {
                await handleFieldClick(async () => {
                  handleMoreMenuNavigate("/transactionhistory");
                  setMenuOpenDrawer(false);
                });
              } else {
                setIsLoginModalOpen(true);
                setAnchorEl(null);
                setMenuOpenDrawer(false);
                return;
              }
            }}
          />
        ) : (
          <img
            src={referEng}
            alt="referimg"
            style={{ width: "190px", borderRadius: "5%", cursor: "pointer" }}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setAnchorEl(null);
              if (loginUserData?.data && loginUserData?.data?.length > 0) {
                await handleFieldClick(async () => {
                  handleMoreMenuNavigate("/transactionhistory");
                  setMenuOpenDrawer(false);
                });
              } else {
                setIsLoginModalOpen(true);
                setAnchorEl(null);
                setMenuOpenDrawer(false);
                return;
              }
            }}
          />
        )}
      </Box>
    </div>
  );
};

