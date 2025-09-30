import { getListAPI, getPostListApi, GetMyPostList, getPremiumAdListApi } from "../../../redux/services/post.api";
import { getData } from "../../../utils/localstorage";

export const fetchCardItems = async ({
  selectedCity,
  isPremiumAd,
  filterValue,
  isPostClear,
  setCombinedPostData,
  setPostData,
  setNormalPostData,
  setTotalRecords,
  setHasMore,
  setIsDataLoaded,
  setIsLoading,
  loginUserData,
  selectedLanguage,
  encryptedAdminAuth,
  setLoadingData,
  setShowPostImages,
  setSlideData,
  API_ENDPOINT_PROFILE,
  searchValue,
  setIsScrollToBottom,
  message
}) => {
  try {
    if (selectedCity || selectedCity === 0) {
      if (isPremiumAd) {
        const payload = {
          PageNumber: filterValue?.PageNumber,
        };
        if (isPostClear) {
          setCombinedPostData([]);
          setPostData([]);
          setNormalPostData([]);
        }
        let response = await getPremiumAdListApi(payload);
        if (response?.success) {
          const updatedData = response?.data?.map((elm) => ({
            ...elm,
            isPremium: true,
          }));

          setPostData((prev) => {
            const combinedData = [...prev, ...updatedData];
            const uniqueData = combinedData?.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
            return uniqueData;
          });
          if (response?.data?.length > 0) {
            setTotalRecords(response?.data?.postList[0].totalcount);
          } else {
            setTotalRecords(0)
          }
          setHasMore(true);
          setIsDataLoaded(true);
        }
      } else {
        const visiteduserData = await getData("visitedUser")
        const mypostPyaload = { "PageSize": filterValue.PageSize, "PageNumber": filterValue.PageNumber, "LanguageId": selectedLanguage }
        const fetchPostAPI = encryptedAdminAuth?.user?.token
          ? filterValue.UserId ? GetMyPostList : getListAPI
          : getPostListApi;
        let response;
        if (fetchPostAPI === GetMyPostList) {
          response = await GetMyPostList(mypostPyaload);
        } else if (fetchPostAPI === getListAPI) {
          const filteredParams = { ...filterValue };
          delete filteredParams.LocationId;
          response = await fetchPostAPI(filteredParams);
        } else {
          const postlistfilter = { ...filterValue, "UnregisteredUserId": visiteduserData?.id }
          response = await fetchPostAPI(postlistfilter);
        }
        if (isPostClear) {
          setNormalPostData([]);
        }
        if (response.success) {
          setIsDataLoaded(true);
          setNormalPostData(response.data.postList);
          if (filterValue.PageNumber === 1) {
            setLoadingData(response.data);
          }
          let updatedPostData = [...response.data.postList];
          if (response.data.premiumAdsList?.length > 0) {
            response.data.premiumAdsList.forEach((premiumAd) => {
              const displayOrder = premiumAd.display_order;
              if (displayOrder !== undefined && displayOrder >= 1) {
                const insertIndex = displayOrder - 1;
                if (insertIndex < updatedPostData?.length) {
                  updatedPostData.splice(insertIndex, 0, {
                    ...premiumAd,
                    isPremium: true,
                  });
                } else {
                  updatedPostData.push({ ...premiumAd, isPremium: true });
                }
              } else {
                updatedPostData.push({ ...premiumAd, isPremium: true });
              }
            });
          }

          const updatePostData = async () => {
            try {
              const convertedArray = await Promise.all(
                updatedPostData.map(async (d) => {
                  let imageData = [];

                  if (d?.pictures) {
                    try {
                      const parsedPictures = JSON.parse(d.pictures);
                      imageData = parsedPictures?.map((elm) => {
                        const imagePath = elm?.SmallImage ? elm.SmallImage.replace(/^~/, "") : "";
                        const imageUrl = `${API_ENDPOINT_PROFILE}/${imagePath}`;
                        return { key: elm?.id, adsimage: imageUrl };
                      });
                    } catch (error) {
                      console.error("Error parsing pictures:", error);
                    }
                  }

                  return {
                    ...d,
                    image: imageData,
                  };
                })
              );

              setPostData((prev) => {
                const combinedData = [...prev, ...convertedArray];
                return combinedData;
              });
            } catch (error) {
              console.error("Error updating post data:", error);
            }
          };

          if (isPostClear) {
            setPostData([]);
            setNormalPostData([])
            await updatePostData();
          } else {
            await updatePostData();
          }

          if (response.data.postList === 0) {
            setHasMore(false);
          }
          if (response?.data?.postList.length > 0) {
            setTotalRecords(response?.data?.postList[0]?.totalcount);
          } else {
            setTotalRecords(0)
          }
          response?.data?.postList.map((d) => {
            if (d?.rownumber === d?.totalcount && searchValue === "") {
              return setIsScrollToBottom(false);
            } else {
              return setIsScrollToBottom(true);
            }
          });
          setIsLoading(false);
        } else {
          setIsLoading(false);
          message.error(response.message);
        }
      }
    }
  } catch (error) {
    setIsLoading(false);
  } finally {
    setIsLoading(false);
  }
}; 