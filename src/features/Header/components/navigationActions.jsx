import React from 'react';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PostAddIcon from '@mui/icons-material/PostAdd';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useTranslation } from 'react-i18next';
import myPostFill from '../../../assets/icons/mypost_fill 1.svg';

export const NavigationActions = ({
  filterValue,
  setFilterValue,
  setIsPostClear,
  handleFavClick,
  loginUserData,
  setIsPremiumAd,
  selectedLanguage,
  setPostData,
  navigate,
  setIsLoginModalOpen,
  selectedCityName,
  setIsLocationPicker
}) => {
  const { t } = useTranslation();

  const handleMyAdsClick = (isActive) => {
    console.log("📢[navigationActions.jsx:27]: ", "click on navigation");
    if (loginUserData.data) {
      setIsPremiumAd(false);
      setFilterValue({
        ...filterValue, 
        PageNumber: 1, 
        LanguageId: selectedLanguage,
        SubCategoryId: "", 
        IsPost: true, 
        UserId: isActive ? 0 : (loginUserData?.data && loginUserData?.data[0]?.id), 
        Favorites: false
      }); 
      setPostData([]); 
      setIsPostClear(true); 
      navigate("/");
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="city-dropdown d-flex justify-content-between mt-10 mb-5">
      <div className="d-flex align-items-center">
        <div className="d-xs-none d-flex align-items-center gap flex-no-wrap">

          {filterValue?.Favorites ? (
            <div 
              onClick={() => { 
                setFilterValue({ ...filterValue, Favorites: false }); 
                setIsPostClear(true) 
              }} 
              className="d-flex align-items-center cursor-pointer"
            >
              <FavoriteIcon className="mr-5" />
              <span>{t("Menus.Favourites")}</span>
            </div>
          ) : (
            <div 
              onClick={handleFavClick} 
              className="d-flex align-items-center cursor-pointer"
            >
              <FavoriteBorderIcon className="mr-5" />
              <span>{t("Menus.Favourites")}</span>
            </div>
          )}

          {filterValue?.UserId ? (
            <div 
              onClick={() => handleMyAdsClick(true)}
              className="d-flex align-items-center cursor-pointer"
            >
              <img 
                src={myPostFill} 
                style={{ 
                  height: "1.5rem", 
                  width: "28%", 
                  marginBottom: "5px", 
                  marginRight: "7px" 
                }} 
                alt="My Ads Active"
              />
              <span>{t("Menus.My Ads")}</span>
            </div>
          ) : (
            <div 
              onClick={() => handleMyAdsClick(false)}
              className="d-flex align-items-center cursor-pointer"
            >
              <PostAddIcon className="mr-5" />
              <span>{t("Menus.My Ads")}</span>
            </div>
          )}
        </div>

        <div
          className="flex items-center location-data mobile-select-city form-container"
          onClick={() => setIsLocationPicker(true)}
        >
          <LocationOnIcon className="icon" />{" "}
          <span className="mr-4 location-text">{selectedCityName}</span>{" "}
          <ExpandMoreIcon className="expand-border icon" />
        </div>
      </div>
    </div>
  );
};
