import { storeData, getData } from "../../../utils/localstorage";
import { updateLanguage } from "../../../redux/services/setting.api";
import { fetchCategoryData } from "../../../redux/slices/category";
import { logEffect } from "../../../utils/logger";
import { logEvents } from "../../../libs/constant";

export const handleChangeLanguage = async ({
  value,
  i18n,
  setIsTransition,
  setSelectedLanguage,
  setIsPostClear,
  dispatch,
  fetchLocation,
  fetchSelectedCityById,
  filterValue,
  setFilterValue,
  LOGEVENTCALL,
  setIsRefetch,
  setTransactionHistoryRefreshKey
}) => {
  if (!value) return;
  
  i18n.changeLanguage(value?.initialname);
  setIsTransition(true);
  await storeData("i18nextLng", value?.value);

  // Always dispatch category data on language change
  const categoryPayload = { LanguageId: value?.value };
  dispatch(fetchCategoryData(categoryPayload));

  setSelectedLanguage(value?.value);
  setTransactionHistoryRefreshKey(true);
  setIsPostClear(true);
  
  const visiteduserData = await getData("visitedUser");
  const payload = {
    LanguageId: value?.value,
    UnregisteredUserId: visiteduserData?.id || null
  };

  const response = await updateLanguage(payload).catch(
    (err) => console.error("Error updating language:", err)
  );
  
  if (response.success) {
    fetchLocation(value?.value);
  }
  
  if (LOGEVENTCALL) {
    logEffect(logEvents.Update_Language);
  }
  
  setFilterValue({ ...filterValue, PageNumber: 1, LanguageId: value?.value });
  fetchSelectedCityById(value?.value);
  setIsRefetch(true)
}; 