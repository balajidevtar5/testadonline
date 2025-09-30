import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdOnlineLogo from "../../../assets/images/adOnlineLogo.png";
import { getData, removeItem } from '../../../utils/localstorage';

export const NavigationLogo = ({
  setIsPremiumAd,
  setFilterValue,
  setIsFeatchCategoryCount,
  setIsPostClear,
  setIsLoading,
  searchValue,
  selectedCity,
  handleMoreMenuNavigate
}) => {
  const navigate = useNavigate();

  const handleLogoClick = async () => {
    handleMoreMenuNavigate("/");
    setIsPremiumAd(false);
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
    // setIsFeatchCategoryCount(true);
    setIsPostClear(true);
    // setIsLoading(true);
    removeItem("adUpdateResponse");
  };

  return (
    <Typography
      variant="h6"
      className="d-flex align-items-center justify-content-start cursor-pointer pr-0"
      onClick={handleLogoClick}
    >
      <img src={AdOnlineLogo} width={120} alt="AdOnline Logo" />
    </Typography>
  );
};
