import { useState } from "react";
import { message } from "antd";
import { ContactCount, favUnFavApiFetch } from "../../../redux/services/post.api";
import { API_ENDPOINT_PROFILE, LOGEVENTCALL, logEvents } from "../../../libs/constant";
import { Favorite } from "@mui/icons-material";

const usePostActionHandler = ({
  loginUserData,
  setIsPutAdModalOpen,
  setInteractionCounts,
  setFavoriteCount,
  favoriteCount,
  sharePost,
  logEffect,
  setIsStaticFav,
  setIsPostClear,
  filterValue,
  setFilterValue,
  handleGetPostDetailsById,
  setSlideData,
  setShowPostImages,
  setIsRefetch,
  callBack,
  t,
}) => { 
  const handleClick = async (e, type, elm,shareOption = null) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    if (type !== "share" && Object.keys(loginUserData || {})?.length === 0) {
      setIsPutAdModalOpen(true);
      return;
    }

    switch (type) {
      case "share":
        try {
          const response = await ContactCount(elm.id);
          if (response?.success) {
            setInteractionCounts((prev) => ({
              ...prev,
              shares: {
                ...prev.shares,
                [elm.id]: response?.data[0]?.sharepost,
              },
            }));
          }
          sharePost(elm,shareOption);
        } catch (error) {
          console.error("Error updating share count:", error);
        }
        break;

      case "favUnFav":
        try {
          const response = await favUnFavApiFetch(elm?.id);
          if (response?.success) {
            // Only call callBack if we're removing from favorites view
            const shouldRefreshList = filterValue?.Favorites && (favoriteCount[elm?.id]?.fav || elm?.userfavorite);

            if (shouldRefreshList) {
              callBack(); // Only refresh when removing from favorites view
            }

            if (filterValue?.Favorites) {
              setIsPostClear(true);
              setFilterValue({ ...filterValue, PageNumber: 1 });
            }
            const isFav = favoriteCount[elm?.id]?.fav || elm?.userfavorite;
            const newLocalFavorites = { ...favoriteCount };
            newLocalFavorites[elm?.id] = isFav ? { fav: 0 } : { fav: 1 };
            setFavoriteCount(newLocalFavorites);

            const contactCountResponse = await ContactCount(elm.id);
            if (contactCountResponse?.success) {
              setInteractionCounts((prev) => ({
                ...prev,
                favorites: {
                  ...prev.favorites,
                  [elm.id]: contactCountResponse.data[0].favorites,
                },
              }));
            }

            if (LOGEVENTCALL) {
              logEvents(logEvents.Saved_Post);
            }
            setIsStaticFav(false);
          }
        } catch (error) {
        }
        break;

      case "more":
        handleGetPostDetailsById(elm);
        break;

      case "image":
        setSlideData([]);
        if (elm.pictures) {
          const slideData = JSON.parse(elm.pictures)?.map((imgElm) => {
            const imagePath = imgElm?.PictureName ? imgElm.PictureName.replace(/^~/, "").replace("/S/", "/Original/") : "";
            const imageUrl = `${API_ENDPOINT_PROFILE}/${imagePath}`;
            return { key: imgElm?.id, image: imageUrl };
          });
          setShowPostImages(true);
          setSlideData(slideData);

          setTimeout(() => {
            const images = document.querySelectorAll("a[data-fancybox='gallery']");
            if (images?.length > 0) images[0].click();
          }, 500);
        }
        handleGetPostDetailsById(elm);
        break;

      case "copy":
        navigator.clipboard.writeText(elm?.shareposturl);
        message.success(t("General.sharePostUrlCopied"));
        break;

      default:
        break;
    }
  };

  return { handleClick };
};

export default usePostActionHandler;
