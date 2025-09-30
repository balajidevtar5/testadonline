import { useCallback, useContext } from "react";
import { LayoutContext } from "../../../components/layout/LayoutContext";
import { removeItem } from "../../../utils/localstorage";
import { fetchCardItems } from "../../../redux/slices/postSlice";

export const useTabHandler = (setIsRefetch,isRefetch,dispatch,encryptedAdminAuth) => {
  const {
    filterValue,
    setFilterValue,
    setIsPremiumAd,
    setIsPostClear,
    setIsLoading,
    isPremiumAd,
    isPostClear,
    selectedCity,
    selectedLanguage,
    prevFilterData,
    searchValue,
    
  } = useContext(LayoutContext);
  

  const handleTabChange = useCallback(
    async (key) => {
      if (key === "1") {
        setFilterValue({
          ...filterValue,
          IsPremiumAd: false,
          IsPost: true,
          PageNumber: 1,
        });
        setIsPremiumAd(false);
        setIsPostClear(true);
        setIsLoading(true);
        await removeItem("filters");
      } else if (key === "2") {
        if (filterValue?.Favorites) {
          setFilterValue({
            ...filterValue,
            IsPremiumAd: false,
            IsPost: false,
            PageNumber: 1,
          });
          setIsPremiumAd(false);
          setIsPostClear(true);

        } else {
          setIsLoading(true);
          setIsPostClear(true);
          dispatch(fetchCardItems({
            isPremiumAd: true,
            isPostClear,
            filterValue,
            selectedCity,
            selectedLanguage,
            prevFilterData,
            searchValue,
            encryptedAdminAuth,
            setIsLoading,
            isRefetch:true,
            setIsRefetch ,
            setIsPostClear

          }));
        }
        await removeItem("filters");
      }
    },
    [filterValue, setFilterValue, setIsPremiumAd, setIsPostClear, setIsLoading]
  );

  return { handleTabChange };
};