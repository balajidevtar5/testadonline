export const handleFavClick = async ({
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
}) => {
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
    setIsPremiumAd(false);
    setIsHomeClick(false);
    setIsLoading(true);
    setPostData([]);
    setIsHomeClick(false);
    navigate("/");
    dispatch && dispatch(
      require("../../Home/../../redux/slices/postSlice").fetchCardItems({
        isPremiumAd: false,
        isPostClear: true,
        filterValue: {
          ...filterValue,
          IsPost: true,
          LanguageId: selectedLanguage,
          SubCategoryId: "",
          PageNumber: 1,
          IsPremiumAd: false,
          Favorites: true,
          UserId: 0
        },
        selectedCity,
        prevFilterData,
        selectedLanguage,
        searchValue,
        encryptedAdminAuth,
        setIsLoading,
        setIsPostClear,
        isRefetch: true
      })
    );
  } else {
    setIsLoginModalOpen(true)
  }
}; 